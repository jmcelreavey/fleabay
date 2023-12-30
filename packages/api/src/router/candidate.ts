import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const candidateRouter = createTRPCRouter({
  deleteSingleCredential: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        type: z.enum(["ACHIEVEMENT", "AFFILIATION", "EVENTATTENDED"]),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return;
    }),
  deleteSinglePlatform: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return;
    }),
  edit: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        old_slug: z.string().min(1).trim(),
        new_slug: z.string().min(1).trim(),
        first_name: z.string().min(1),
        middle_name: z.string().nullable(),
        last_name: z.string().min(1),
        election_id: z.string().min(1),
        position_id: z.string().min(1),
        partylist_id: z.string().min(1),
        image: z
          .object({
            name: z.string().min(1),
            type: z.string().min(1),
            base64: z.string().min(1),
          })
          .nullish(),

        credential_id: z.string().min(1),

        platforms: z.array(
          z.object({
            id: z.string(),
            title: z.string().min(1),
            description: z.string().min(1).nullable(),
          }),
        ),

        achievements: z.array(
          z.object({
            id: z.string(),
            name: z.string().min(1),
            year: z.date(),
          }),
        ),
        affiliations: z.array(
          z.object({
            id: z.string(),
            org_name: z.string().min(1),
            org_position: z.string().min(1),
            start_year: z.date(),
            end_year: z.date(),
          }),
        ),
        eventsAttended: z.array(
          z.object({
            id: z.string(),
            name: z.string().min(1),
            year: z.date(),
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return;
    }),
  createSingle: protectedProcedure
    .input(
      z.object({
        slug: z.string().min(1).trim().toLowerCase(),
        first_name: z.string().min(1),
        middle_name: z.string().nullable(),
        last_name: z.string().min(1),
        election_id: z.string().min(1),
        position_id: z.string().min(1),
        partylist_id: z.string().min(1),
        image: z
          .object({
            name: z.string().min(1),
            type: z.string().min(1),
            base64: z.string().min(1),
          })
          .nullable(),

        platforms: z.array(
          z.object({
            title: z.string().min(1),
            description: z.string().min(1).nullable(),
          }),
        ),

        achievements: z.array(
          z.object({
            name: z.string().min(1),
            year: z.date(),
          }),
        ),
        affiliations: z.array(
          z.object({
            org_name: z.string().min(1),
            org_position: z.string().min(1),
            start_year: z.date(),
            end_year: z.date(),
          }),
        ),
        eventsAttended: z.array(
          z.object({
            name: z.string().min(1),
            year: z.date(),
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return;
    }),
  delete: protectedProcedure
    .input(
      z.object({
        candidate_id: z.string().min(1),
        election_id: z.string().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return;
    }),
  getDashboardData: protectedProcedure
    .input(
      z.object({
        election_id: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      return;
    }),
  getPageData: publicProcedure
    .input(
      z.object({
        election_slug: z.string().min(1),
        candidate_slug: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      return;
    }),
});
