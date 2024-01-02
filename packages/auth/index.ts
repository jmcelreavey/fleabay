import GoogleProvider from "@auth/core/providers/google";
import type { DefaultSession } from "@auth/core/types";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";

// import EmailProvider from "next-auth/providers/email";

import { db } from "@fleabay/db";

import { env } from "./env.mjs";

export type { Session } from "next-auth";

// Update this whenever adding new providers so that the client can
export const providers = ["google", "email"] as const;
export type OAuthProviders = (typeof providers)[number];

declare module "next-auth" {
  interface Session {
    user: {
      sellerId?: string;
      buyerId?: string;
      id: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
  }
}

export const {
  handlers: { GET, POST },
  update,
  auth,
} = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }) as Provider,
  ],
  callbacks: {
    session: async ({ session, user }) => {
      const existingUser = await db.user.findFirst({
        where: {
          id: user.id,
        },
        include: {
          buyer: true,
          seller: true,
        },
      });

      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          sellerId: existingUser?.seller?.id ?? undefined,
          buyerId: existingUser?.buyer?.id ?? undefined,
        },
      };
    },
  },
});
