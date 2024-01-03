import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { update } from "@fleabay/auth";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        // firstName: z.string(),
        // middleName: z.string().nullable(),
        // lastName: z.string(),
        image: z
          .object({
            name: z.string().min(1),
            type: z.string().min(1),
            base64: z.string().min(1),
          })
          .nullish(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.db.user.findFirst({
        where: {
          id: ctx.session.user.id,
        },
      });

      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      return await ctx.db.$transaction(async (db) => {
        const image_file = input.image
          ? await fetch(input.image.base64)
              .then((res) => res.blob())
              .then(
                async (blob) =>
                  (
                    await ctx.utapi.uploadFiles(
                      new File([blob], `user_image_${ctx.session.user.id}`, {
                        type: input.image!.type,
                      }),
                    )
                  ).data,
              )
          : input.image;

        if (user.image && !image_file && !input.image)
          await ctx.utapi.deleteFiles(user.image);

        await db.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            // first_name: input.firstName,
            // middle_name: input.middleName,
            // last_name: input.lastName,
            name: input.name,
            image: image_file
              ? image_file.url
              : input.image
                ? user.image
                : null,
          },
        });

        return update({
          user: {
            ...ctx.session.user,
            name: input.name,
            image: image_file
              ? image_file.url
              : input.image
                ? user.image
                : null,
          },
        });
      });
    }),

  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.$transaction(async (db) => {
      const user = await db.user.findFirst({
        where: {
          id: ctx.session.user.id,
        },
      });

      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      const account = await db.account.findFirst({
        where: {
          userId: ctx.session.user.id,
        },
      });

      if (!account) throw new TRPCError({ code: "NOT_FOUND" });

      await db.user.delete({
        where: {
          id: ctx.session.user.id,
        },
      });

      await db.account.deleteMany({
        where: {
          userId: ctx.session.user.id,
        },
      });
    });

    return true;
  }),
});
