import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { takenSlugs } from "@fleabay/constants";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const electionRouter = createTRPCRouter({
  getElectionPage: publicProcedure
    .input(
      z.object({
        election_slug: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      return;
    }),
  vote: protectedProcedure
    .input(
      z.object({
        election_id: z.string(),
        votes: z.array(
          z.object({
            position_id: z.string(),
            votes: z
              .object({
                isAbstain: z.literal(true),
              })
              .or(
                z.object({
                  isAbstain: z.literal(false),
                  candidates: z.array(z.string()),
                }),
              ),
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return;
    }),
  getElectionBySlug: publicProcedure
    .input(
      z.object({
        election_slug: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      return;
    }),
  getDashboardOverviewData: protectedProcedure
    .input(
      z.object({
        election_slug: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      return;
    }),
  reportAProblem: protectedProcedure
    .input(
      z.object({
        subject: z.string().min(1),
        description: z.string().min(1),
        election_id: z.string().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return;
    }),
  getElectionVoting: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      return;
    }),
  getElectionRealtime: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      return;
    }),
  getVotersByElectionSlug: protectedProcedure
    .input(
      z.object({
        election_slug: z.string().min(1),
      }),
    )
    .query(async ({ input, ctx }) => {
      return;
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        slug: z.string().min(1).trim().toLowerCase(),
        date: z.custom<[Date, Date]>(),
        template: z.string(),
        voting_hours: z.array(z.number()),
      }),
    )
    .mutation(({ ctx, input }) => {
      if (takenSlugs.includes(input.slug)) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Election slug is already exists",
        });
      }

      if (!Array.isArray(input.date) || input.date.length !== 2) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Date must be an array of 2",
        });
      }

      return;
    }),
  edit: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        description: z.string().nullable(),
        oldSlug: z.string().trim().toLowerCase(),
        newSlug: z.string().min(1).trim().toLowerCase(),
        date: z.custom<[Date, Date]>(),
        // voter_domain: z.string().nullable(),
        voting_hours: z.array(z.number()),
        logo: z
          .object({
            name: z.string().min(1),
            type: z.string().min(1),
            base64: z.string().min(1),
          })
          .nullish(),
      }),
    )
    .mutation(({ ctx, input }) => {
      if (input.newSlug !== input.oldSlug) {
        if (takenSlugs.includes(input.newSlug)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Election slug is already exists",
          });
        }

        // if (input.voter_domain) {
        //   if (input.voter_domain === "gmail.com")
        //     throw new TRPCError({
        //       code: "BAD_REQUEST",
        //       message: "Gmail is not allowed",
        //     });

        //   if (input.voter_domain.includes("@"))
        //     throw new TRPCError({
        //       code: "BAD_REQUEST",
        //       message: "Please enter only the domain name",
        //     });
        // }

        return;
      }
    }),
  delete: protectedProcedure
    .input(
      z.object({
        election_id: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return;
    }),
  getVoterFieldsStats: protectedProcedure
    .input(
      z.object({
        election_id: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      return;
    }),
  getVoterFieldsStatsInRealtime: publicProcedure
    .input(
      z.object({
        election_id: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      return;
    }),
  getElectionProgress: protectedProcedure
    .input(
      z.object({
        election_id: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      return;
    }),
  getAllPublicElections: publicProcedure.query(async ({ ctx }) => {
    return;
  }),
  getAllCommissionerByElectionSlug: protectedProcedure
    .input(z.object({ election_slug: z.string() }))
    .query(async ({ ctx, input }) => {
      return;
    }),
  addCommissioner: protectedProcedure
    .input(
      z.object({
        election_id: z.string().min(1),
        email: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.email === input.email)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot add yourself as a commissioner",
        });

      return;
    }),
  deleteCommissioner: protectedProcedure
    .input(
      z.object({
        election_id: z.string().min(1),
        commissioner_id: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // check if the commissioner is the creator of the election

      return;
    }),
  getMyElectionAsCommissioner: protectedProcedure.query(async ({ ctx }) => {
    return;
  }),
  getMyElectionAsVoter: protectedProcedure.query(async ({ ctx }) => {
    return;
  }),
  messageCommissioner: protectedProcedure
    .input(
      z.object({
        election_id: z.string().min(1),
        title: z.string().min(1),
        message: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return;
    }),
  getAllMyMessages: protectedProcedure
    .input(
      z.object({
        election_id: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      return;
    }),
  messageAdmin: protectedProcedure
    .input(
      z.object({
        election_slug: z.string().min(1),
        title: z.string().min(1),
        message: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return;
    }),
  getAllCommissionerVoterRooms: protectedProcedure
    .input(
      z.object({
        election_slug: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      return;
    }),
  getAllAdminCommissionerRooms: protectedProcedure
    .input(
      z.object({
        election_slug: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      return;
    }),
  getMessagesAsVoter: protectedProcedure
    .input(
      z.object({
        room_id: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      return;
    }),
  getMessagesAsComissioner: protectedProcedure
    .input(
      z.object({
        type: z.enum(["admin", "voters"]),
        room_id: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (input.type === "voters") {
        return;
      } else {
        return;
      }
    }),
  sendMessageAsVoter: protectedProcedure
    .input(
      z.object({
        room_id: z.string().min(1),
        message: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return;
    }),
  sendMessageAsCommissioner: protectedProcedure
    .input(
      z.object({
        type: z.enum(["admin", "voters"]),
        room_id: z.string().min(1),
        message: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.type === "voters") {
        return;
      }
    }),
});
