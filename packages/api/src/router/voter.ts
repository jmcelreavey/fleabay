import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const voterRouter = createTRPCRouter({
  createSingle: protectedProcedure
    .input(
      z.object({
        email: z.string().min(1),
        election_id: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return;
    }),
  getAllVoterField: protectedProcedure
    .input(
      z.object({
        election_id: z.string().min(1),
      }),
    )
    .query(async ({ input, ctx }) => {
      return;
    }),
  deleteSingleVoterField: protectedProcedure
    .input(
      z.object({
        election_id: z.string().min(1),
        field_id: z.string().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return;
    }),
  edit: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        email: z.string().min(1),
        election_id: z.string().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return;
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        election_id: z.string().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return;
    }),
  deleteBulk: protectedProcedure
    .input(
      z.object({
        election_id: z.string().min(1),
        voters: z.array(
          z.object({
            id: z.string().min(1),
            email: z.string().min(1),
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return;
    }),
  uploadBulk: protectedProcedure
    .input(
      z.object({
        election_id: z.string().min(1),
        voters: z.array(
          z.object({
            email: z.string().min(1),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return;
    }),
  addVoterFieldToVoter: protectedProcedure
    .input(
      z.object({
        election_id: z.string().min(1),
        voter_id: z.string().min(1),
        fields: z.array(
          z.object({
            id: z.string().min(1),
            value: z.string().min(1),
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return;
    }),
});
