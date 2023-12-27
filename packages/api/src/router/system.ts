import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const systemRouter = createTRPCRouter({
  sendMessage: publicProcedure
    .input(
      z.object({
        name: z.string().optional(),
        message: z.string(),
        subject: z.string(),
        email: z.string().email(),
      }),
    )
    .mutation(async () => {
      // TODO: Send email
    }),
});
