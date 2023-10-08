import { cookies, headers } from "next/headers";
import { loggerLink } from "@trpc/client";
import { experimental_nextCacheLink as nextCacheLink } from "@trpc/next/app-dir/links/nextCache";
import { experimental_createTRPCNextAppDirServer as createTRPCNextAppDirServer } from "@trpc/next/app-dir/server";
// import { experimental_nextHttpLink as nextHttpLink } from "@trpc/next/app-dir/links/nextHttp";
import superjson from "superjson";

import { appRouter } from "@eboto-mo/api";
import type { AppRouter } from "@eboto-mo/api";
import { auth } from "@eboto-mo/auth";
import { db } from "@eboto-mo/db";
import { utapi } from "@eboto-mo/storage";

import { endingLink } from "./shared";

/**
 * This client invokes procedures directly on the server without fetching over HTTP.
 */
export const api = createTRPCNextAppDirServer<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        loggerLink({
          enabled: () => true,
        }),
        endingLink({
          headers: Object.fromEntries(headers().entries()),
        }),
        nextCacheLink({
          revalidate: false,
          router: appRouter,
          async createContext() {
            return {
              utapi,
              session: await auth(),
              db,
              headers: {
                cookie: cookies().toString(),
                "x-trpc-source": "rsc-invoke",
              },
            };
          },
        }),
      ],
    };
  },
});
