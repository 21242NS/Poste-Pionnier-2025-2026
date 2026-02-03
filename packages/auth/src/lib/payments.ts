import { Polar } from "@polar-sh/sdk";
import { env } from "@Poste-Pionnier-2025-2026/env/server";

export const polarClient = new Polar({
  accessToken: env.POLAR_ACCESS_TOKEN,
  server: "sandbox",
});
