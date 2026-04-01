import { expo } from "@better-auth/expo";
import prisma from "@Poste-Pionnier-2025-2026/db";
import { env } from "@Poste-Pionnier-2025-2026/env/server";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { tanstackStartCookies } from "better-auth/tanstack-start";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: [
    env.CORS_ORIGIN,
    "mybettertapp://",
    ...(env.NODE_ENV === "development"
      ? ["exp://", "exp://**", "exp://192.168.*.*:*/**", "http://localhost:8081"]
      : []),
  ],
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "parent", // Rôle par défaut lors de l'inscription
        required: true,
      },
    },
  },
  plugins: [
    tanstackStartCookies(),
    expo(),
  ],
});
