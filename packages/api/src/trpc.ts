import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { UTApi } from "uploadthing/server";
import { ZodError } from "zod";

import type { Session } from "@fleabay/auth";
import { auth } from "@fleabay/auth";
import { db } from "@fleabay/db";
import { inngest } from "@fleabay/inngest";
import * as payment from "@fleabay/payment";

// import { env } from "./env.mjs";

interface CreateContextOptions {
  session: Session | null;
  utapi: UTApi;
  payment: typeof payment;
  inngest: typeof inngest;
}
const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    ...opts, 
    db,
    payment
  };
};

export async function createTRPCContext(opts: {
  req?: Request;
  session: Session | null;
}) {
  // const source = opts.req?.headers.get("x-trpc-source") ?? "unknown";

  // console.log(">>> tRPC Request from", source, "by", session?.user);

  return createInnerTRPCContext({
    session: opts.session ?? (await auth()),
    utapi: new UTApi({
      // fetch: globalThis.fetch,
      // apiKey: env.UPLOADTHING_SECRET,
    }),
    payment, 
    inngest
  });
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter(opts) {
    const { shape, error } = opts;
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === "BAD_REQUEST" && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    };
  },
});
/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      session: {
        ...ctx.session,
      },
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
