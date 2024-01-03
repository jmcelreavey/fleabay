import { TRPCError } from "@trpc/server";
import dayjs from "dayjs";
import type Decimal from "decimal.js";
import { z } from "zod";

import type { Auction, Bid, Buyer, Seller } from "@fleabay/db";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const auctionRouter = createTRPCRouter({
  get: publicProcedure
    .input(
      z.object({
        sellerId: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      let buyer: (Buyer & { bids: Bid[] }) | null = null;
      let seller: (Seller & { auctions: Auction[] }) | null = null;
      if (ctx.session?.user?.id) {
        buyer = await ctx.db.buyer.findFirst({
          where: {
            userId: ctx.session.user.id,
          },
          include: {
            bids: {
              where: {
                auction: {
                  endDate: {
                    gt: new Date(),
                  },
                },
              },
            },
          },
        });

        seller = await ctx.db.seller.findFirst({
          where: {
            userId: ctx.session.user.id,
          },
          include: {
            auctions: {
              where: {
                endDate: {
                  gt: new Date(),
                },
              },
            },
          },
        });
      }

      const auctions = await ctx.db.auction.findMany({
        select: {
          id: true,
          sellerId: true,
          startingPrice: true,
          bidIncrement: true,
          name: true,
          description: true,
          endDate: true,
          images: true,
          bids: {
            orderBy: {
              amount: "desc",
            },
            take: 2,
          },
        },
        where: {
          sellerId: input.sellerId ?? undefined,
          startDate: {
            lte: dayjs().toDate(),
          },
          endDate: {
            gt: dayjs().toDate(),
          },
        },
      });

      const auctionWithCurrentPrice = auctions.map((auction) => {
        // If there are no bids, the current price is the starting price
        let currentPrice = auction.startingPrice;
        let isHighestBidder = false;
        const isOwner = auction.sellerId === seller?.id;
        let isOutbid = false;

        // If there is a second bid, the current price is the second bid + the bid increment
        if (auction.bids[1]) {
          currentPrice = auction.bids[1].amount.add(auction.bidIncrement);
        }

        // If there is only one bid, the current price is the starting price + the bid increment
        if (auction.bids[0]) {
          isHighestBidder = Boolean(
            buyer?.id && auction.bids[0].buyerId === buyer.id,
          );

          // If the user is the highest bidder, the current price is the highest bid
          currentPrice = currentPrice.add(
            isHighestBidder || isOwner ? 0 : auction.bidIncrement,
          );

          isOutbid =
            buyer?.bids?.some(
              (bid) =>
                bid.auctionId === auction.id &&
                bid.amount < currentPrice &&
                !isHighestBidder,
            ) ?? false;
        }

        return {
          ...auction,
          currentPrice,
          isHighestBidder,
          isOutbid,
          isOwner,
        };
      });

      return auctionWithCurrentPrice;
    }),
  create: protectedProcedure
    .input(
      z
        .object({
          startingPrice: z
            .string()
            .refine(
              (value) => !isNaN(parseFloat(value)),
              "Starting price must be a valid number",
            )
            .refine(
              (value) => parseFloat(value) > 0,
              "Starting price must be greater than 0",
            ),
          name: z.string().min(1),
          description: z.string().min(1),
          startDate: z.date().min(dayjs().subtract(1, "day").toDate()),
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
      let seller = await ctx.db.seller.findFirst({
        where: {
          userId: ctx.session.user.id,
        },
      });

      if (!seller) {
        seller = await ctx.db.seller.create({
          data: {
            userId: ctx.session.user.id,
          },
        });
      }

      const { images: _images, ...rest } = input;

      await ctx.db.auction.create({ data: { ...rest, sellerId: seller.id } });
    }),
  edit: protectedProcedure
    .input(
      z
        .object({
          id: z.number(),
          startingPrice: z
            .string()
            .refine(
              (value) => !isNaN(parseFloat(value)),
              "Starting price must be a valid number",
            )
            .refine(
              (value) => parseFloat(value) > 0,
              "Starting price must be greater than 0",
            ),
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
  bid: protectedProcedure
    .input(
      z.object({
        auctionId: z.number(),
        amount: z
          .string()
          .refine(
            (value) => !isNaN(parseFloat(value)),
            "Starting price must be a valid number",
          )
          .refine(
            (value) => parseFloat(value) > 0,
            "Starting price must be greater than 0",
          ),
      }),
    )
    .mutation(
      async ({
        input,
        ctx,
      }): Promise<
        { isHighestBid: true } | { isHighestBid: false; nextIncrement: Decimal }
      > => {
        const auction = await ctx.db.auction.findFirst({
          where: {
            id: input.auctionId,
            endDate: {
              gt: new Date(),
            },
          },
        });

        if (!auction) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }

        if (auction.startingPrice.greaterThan(input.amount)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Bid must be greater than the starting price",
          });
        }

        let buyer = await ctx.db.buyer.findFirst({
          where: {
            userId: ctx.session.user.id,
          },
        });

        if (!buyer) {
          buyer = await ctx.db.buyer.create({
            data: {
              userId: ctx.session.user.id,
            },
          });
        }

        await ctx.db.bid.create({
          data: {
            amount: input.amount,
            auctionId: input.auctionId,
            buyerId: buyer.id,
          },
        });

        const highestBids = await ctx.db.bid.findMany({
          where: {
            auctionId: input.auctionId,
          },
          orderBy: {
            amount: "desc",
          },
          take: 2,
        });

        const highestBid = highestBids[0];
        const secondHighestBid = highestBids[1];

        const isHighestBid = highestBid?.buyerId === buyer.id;
        return isHighestBid
          ? { isHighestBid: true }
          : {
              isHighestBid: false,
              nextIncrement: secondHighestBid!.amount.add(auction.bidIncrement),
            };
      },
    ),
});
