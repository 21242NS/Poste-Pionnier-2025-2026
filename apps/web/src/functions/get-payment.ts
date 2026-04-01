import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/middleware/auth";

export const getPayment = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    return null;
  });
