import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";

export const env = createEnv({
  shared: {},
  server: {
    UPLOADTHING_SECRET: z.string().min(1),
    LEMONSQUEEZY_FREE_VARIANT_ID: z.number().min(1),
    LEMONSQUEEZY_BOOST_PRODUCT_ID: z.number().min(1),
    LEMONSQUEEZY_PLUS_VARIANT_ID: z.number().min(1),
    LEMONSQUEEZY_STORE_ID: z.number().min(1),
  },
  client: {},
  // Client side variables gets destructured here due to Next.js static analysis
  // Shared ones are also included here for good measure since the behavior has been inconsistent
  runtimeEnv: {
    UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
    LEMONSQUEEZY_FREE_VARIANT_ID: parseInt(
      process.env.LEMONSQUEEZY_FREE_VARIANT_ID ?? "-1",
    ),
    LEMONSQUEEZY_BOOST_PRODUCT_ID: parseInt(
      process.env.LEMONSQUEEZY_BOOST_PRODUCT_ID ?? "-1",
    ),
    LEMONSQUEEZY_PLUS_VARIANT_ID: parseInt(
      process.env.LEMONSQUEEZY_PLUS_VARIANT_ID ?? "-1",
    ),
    LEMONSQUEEZY_STORE_ID: parseInt(process.env.LEMONSQUEEZY_STORE_ID ?? "-1"),
    APP_URL: process.env.APP_URL,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
