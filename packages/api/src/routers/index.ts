import type { RouterClient } from "@orpc/server";

import { commandRouter } from "./command";
import { ticket  } from "./ticket";
import { protectedProcedure, publicProcedure } from "../index";

export const appRouter = {
  ...commandRouter,
  healthCheck: publicProcedure.handler(() => {
    return "OK";
  }),
  privateData: protectedProcedure.handler(({ context }) => {
    return {
      message: "This is private",
      user: context.session?.user,
    };
  }),
  ticket,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
