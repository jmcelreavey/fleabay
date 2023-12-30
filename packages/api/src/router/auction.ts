import { createTRPCRouter, publicProcedure } from "../trpc";

export const auctionRouter = createTRPCRouter({
  getAuctions: publicProcedure.query(async ({ ctx }) => {
    const auctions = await ctx.db.auction.findMany({
      include: {
        images: true,
      },
    });

    return auctions;
  }),
});
