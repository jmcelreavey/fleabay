import { createTRPCRouter, publicProcedure } from "../trpc";

export const auctionRouter = createTRPCRouter({
  getAuctions: publicProcedure.query(async ({ ctx }) => {
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
});
