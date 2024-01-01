import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const auctionRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    const auctions = await ctx.db.auction.findMany({
      select: {
        startingPrice: true,
        name: true,
        description: true,
        endDate: true,
        images: true,
        highestBid: true,
      },
    });

    const auctionWithCurrentPrice = auctions.map((auction) => {
      const currentPrice = auction.highestBid
        ? auction.highestBid.amount
        : auction.startingPrice;
      return { ...auction, currentPrice };
    });

    return auctionWithCurrentPrice;
  }),
  createSingle: protectedProcedure
    .input(
      z
        .object({
          startingPrice: z.number().min(1),
          name: z.string().min(1),
          description: z.string().min(1),
          startDate: z.date().min(new Date()),
          endDate: z.date(),
          images: z
            .array(
              z.object({
                name: z.string().min(1),
                type: z.string().min(1),
                base64: z.string().min(1),
              }),
            )
            .nullable(),
        })
        .refine((data) => data.endDate > data.startDate, {
          message: "End date must be later than start date",
          path: ["endDate"],
        }),
    )
    .mutation(async ({ input, ctx }) => {
      const seller = await ctx.db.seller.findFirst({
        where: {
          userId: ctx.session.user.id,
        },
      });

      if (!seller) {
        await ctx.db.seller.create({
          data: {
            userId: ctx.session.user.id,
          },
        });
      }

      const { images: _images, ...rest } = input;

      await ctx.db.auction.create({ data: { ...rest, sellerId: seller!.id } });
    }),
  editSingle: protectedProcedure
    .input(
      z
        .object({
          id: z.number(),
          startingPrice: z.number().min(1),
          name: z.string().min(1),
          description: z.string().min(1),
          startDate: z.date().min(new Date()),
          endDate: z.date(),
          images: z
            .array(
              z.object({
                name: z.string().min(1),
                type: z.string().min(1),
                base64: z.string().min(1),
              }),
            )
            .nullish(),
        })
        .refine((data) => data.endDate > data.startDate, {
          message: "End date must be later than start date",
          path: ["endDate"],
        }),
    )
    .mutation(async ({ input, ctx }) => {
      const auction = await ctx.db.auction.findFirst({
        where: {
          id: input.id,
          seller: {
            userId: ctx.session.user.id,
          },
        },
      });

      if (!auction) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const { images: _images, ...rest } = input;

      await ctx.db.auction.update({
        where: { id: input.id },
        data: { ...rest },
      });
    }),
  deleteSingle: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const auction = await ctx.db.auction.findFirst({
        where: {
          id: input.id,
          seller: {
            userId: ctx.session.user.id,
          },
        },
      });

      if (!auction) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await ctx.db.auction.delete({ where: { id: input.id } });
    }),
});
