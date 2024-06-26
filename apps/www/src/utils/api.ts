import { createTRPCReact } from "@trpc/react-query";

import type { AppRouter } from "@fleabay/api";

export const api = createTRPCReact<AppRouter>();

export { type RouterInputs, type RouterOutputs } from "@fleabay/api";
