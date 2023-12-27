import { createTRPCReact } from "@trpc/react-query";

import type { AppRouter } from "@fleabay/api";

export const api = createTRPCReact<AppRouter>({});
