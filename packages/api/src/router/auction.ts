import { createTRPCRouter, publicProcedure } from "../trpc";

export const auctionRouter = createTRPCRouter({
  getAuctions: publicProcedure.query(async ({ ctx }) => {
    const auctions = await ctx.db.query.auctions.findMany({
      with: {
        auction_images: true,
      },
    });

    return auctions;
  }),
});
