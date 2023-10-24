import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { z } from "zod";

import { and, eq, inArray } from "@eboto-mo/db";
import { voter_fields, voters } from "@eboto-mo/db/schema";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const voterRouter = createTRPCRouter({
  createSingle: protectedProcedure
    .input(
      z.object({
        email: z.string().nonempty(),
        election_id: z.string().nonempty(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const isElectionExists = await ctx.db.query.elections.findFirst({
        where: (elections, { eq }) => eq(elections.id, input.election_id),
        with: {
          commissioners: {
            where: (commissioners, { eq }) =>
              eq(commissioners.user_id, ctx.session.user.id),
          },
        },
      });

      if (!isElectionExists)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Election does not exists",
        });

      if (isElectionExists.commissioners.length === 0)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        });

      const votersFromDb = await ctx.db.query.voters.findFirst({
        where: (voter, { eq, and }) =>
          and(
            eq(voter.election_id, input.election_id),
            eq(voter.email, input.email),
          ),
      });

      if (votersFromDb)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email is already a voter",
        });

      await ctx.db.transaction(async (db) => {
        await db.insert(voters).values({
          id: nanoid(),
          email: input.email,
          election_id: isElectionExists.id,
        });
      });
    }),
  getAllVoterField: protectedProcedure
    .input(
      z.object({
        election_id: z.string().nonempty(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const isElectionExists = await ctx.db.query.elections.findFirst({
        where: (election, { eq }) => eq(election.id, input.election_id),
      });

      if (!isElectionExists)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Election does not exists",
        });

      const isElectionCommissionerExists =
        await ctx.db.query.commissioners.findFirst({
          where: (commissioner, { eq, and }) =>
            and(
              eq(commissioner.election_id, input.election_id),
              eq(commissioner.user_id, ctx.session.user.id),
            ),
        });

      if (!isElectionCommissionerExists)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        });

      return await ctx.db.query.voter_fields.findMany({
        where: (voter_fields, { eq }) =>
          eq(voter_fields.election_id, input.election_id),
      });
    }),
  updateVoterField: protectedProcedure
    .input(
      z.object({
        fields: z.array(
          z.object({
            id: z.string().nonempty(),
            name: z.string().nonempty(),
            type: z.enum(["fromDb", "fromInput"]),
          }),
        ),
        election_id: z.string().nonempty(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db.transaction(async (db) => {
        await db
          .delete(voter_fields)
          .where(eq(voter_fields.election_id, input.election_id));

        await db.insert(voter_fields).values(
          input.fields.map((field) => ({
            name: field.name,
            election_id: input.election_id,
          })),
        );
      });
    }),
  deleteSingleVoterField: protectedProcedure
    .input(
      z.object({
        election_id: z.string().nonempty(),
        field_id: z.string().nonempty(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db
        .delete(voter_fields)
        .where(
          and(
            eq(voter_fields.election_id, input.election_id),
            eq(voter_fields.id, input.field_id),
          ),
        );
    }),
  edit: protectedProcedure
    .input(
      z.object({
        id: z.string().nonempty(),
        email: z.string().nonempty(),
        election_id: z.string().nonempty(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // TODO: Validate commissioner
      const isElectionExists = await ctx.db.query.elections.findFirst({
        where: (elections, { eq }) => eq(elections.id, input.election_id),
      });

      if (!isElectionExists)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Election does not exists",
        });

      const isElectionCommissionerExists =
        await ctx.db.query.commissioners.findFirst({
          where: (commissioner, { eq, and }) =>
            and(
              eq(commissioner.election_id, input.election_id),
              eq(commissioner.user_id, ctx.session.user.id),
            ),
        });

      if (!isElectionCommissionerExists)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        });

      await ctx.db
        .update(voters)
        .set({
          email: input.email,
        })
        .where(eq(voters.id, input.id));

      return { type: "voter" };
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string().nonempty(),
        election_id: z.string().nonempty(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const isElectionExists = await ctx.db.query.elections.findFirst({
        where: (election, { eq }) => eq(election.id, input.election_id),
      });

      if (!isElectionExists)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Election does not exists",
        });

      const isElectionCommissionerExists =
        await ctx.db.query.commissioners.findFirst({
          where: (commissioner, { eq, and }) =>
            and(
              eq(commissioner.election_id, input.election_id),
              eq(commissioner.user_id, ctx.session.user.id),
            ),
        });

      if (!isElectionCommissionerExists)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        });

      const voter = await ctx.db.query.voters.findFirst({
        where: (voter, { eq, and }) =>
          and(eq(voter.id, input.id), eq(voter.election_id, input.election_id)),
      });

      if (!voter)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Voter not found",
        });

      await ctx.db
        .delete(voters)
        .where(
          and(
            eq(voters.id, input.id),
            eq(voters.election_id, input.election_id),
          ),
        );
    }),
  deleteBulk: protectedProcedure
    .input(
      z.object({
        election_id: z.string().nonempty(),
        voters: z.array(
          z.object({
            id: z.string().nonempty(),
            email: z.string().nonempty(),
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // TODO: Validate commissioner
      const votersIds = input.voters.map((voter) => voter.id);

      if (votersIds.length)
        await ctx.db
          .delete(voters)
          .where(
            and(
              eq(voters.election_id, input.election_id),
              inArray(voters.id, votersIds),
            ),
          );

      return {
        count: votersIds.length,
      };
    }),
  uploadBulk: protectedProcedure
    .input(
      z.object({
        election_id: z.string().nonempty(),
        voters: z.array(
          z.object({
            email: z.string().nonempty(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: Validate commissioner
      const isElectionExists = await ctx.db.query.elections.findFirst({
        where: (elections, { eq }) => eq(elections.id, input.election_id),
        with: {
          commissioners: {
            where: (commissioners, { eq }) =>
              eq(commissioners.user_id, ctx.session.user.id),
          },
        },
      });

      if (!isElectionExists) throw new Error("Election does not exists");

      if (isElectionExists.commissioners.length === 0)
        throw new Error("Unauthorized");

      // await Promise.all(
      //   input.voters.map(async (voter) => {
      //     await isVoterOrInvitedVoterExists({
      //       election_id: input.election_id,
      //       email: voter.email,
      //     });
      //   }),
      // );

      return {
        count: input.voters.length,
      };
    }),
});