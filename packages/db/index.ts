import { env } from "process";
import { PrismaClient } from "@prisma/client";

interface GlobalForPrisma {
  prisma: PrismaClient | undefined;
}

const globalForPrisma: GlobalForPrisma =
  globalThis as unknown as GlobalForPrisma;

export const db: PrismaClient =
  globalForPrisma.prisma ??
  (new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  }) as PrismaClient);

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export * from "@prisma/client";
