import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";

export const env = createEnv({
  shared: {},
  server: {
    UPLOADTHING_SECRET: z.string().min(1),
  },
  client: {},
  // Client side variables gets destructured here due to Next.js static analysis
  // Shared ones are also included here for good measure since the behavior has been inconsistent
  runtimeEnv: {
    UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
