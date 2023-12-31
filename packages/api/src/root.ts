import { auctionRouter } from "./router/auction";
import { authRouter } from "./router/auth";
import { userRouter } from "./router/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  user: userRouter,
  auction: auctionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
