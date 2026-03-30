import { ORPCError } from "@orpc/server";
import { z } from "zod";
import prisma from "@Poste-Pionnier-2025-2026/db";
import { auth } from "@Poste-Pionnier-2025-2026/auth";

import { publicProcedure, protectedProcedure } from "../index";

// Rôles disponibles pour l'auto-inscription (pas admin)
const PUBLIC_ROLES = ["parent", "animee", "animateur", "extern"] as const;

export const authRouter = {
  signUpWithRole: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string().min(2),
        role: z.enum(PUBLIC_ROLES),
      }),
    )
    .handler(async ({ input }) => {
      // Vérifier si l'email existe déjà
      const existingUser = await prisma.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new ORPCError("CONFLICT");
      }

      try {
        // Créer l'utilisateur avec Better Auth
        const result = await auth.api.signUpEmail({
          body: {
            email: input.email,
            password: input.password,
            name: input.name,
          },
        });

        // Mettre à jour le rôle après création
        // Note: Il y a un court délai ici (race condition potentielle)
        if (result.user) {
          await prisma.user.update({
            where: { id: result.user.id },
            data: { role: input.role },
          });
        }

        return { success: true, user: result.user };
      } catch (error) {
        // Si l'utilisateur a été créé mais le rôle n'a pas été défini, nettoyer
        if (error instanceof Error && error.message.includes("update")) {
          // Tentative de nettoyage (optionnel selon votre logique)
        }
        throw new ORPCError("BAD_REQUEST");
      }
    }),

  // Endpoint réservé aux admins pour créer d'autres admins
  createAdmin: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string().min(2),
      }),
    )
    .handler(async ({ input, context }) => {
      // Vérifier que l'utilisateur connecté est admin
      const currentUser = await prisma.user.findUnique({
        where: { id: context.session.user.id },
      });

      if (currentUser?.role !== "admin") {
        throw new ORPCError("FORBIDDEN");
      }

      try {
        // Créer l'utilisateur admin
        const result = await auth.api.signUpEmail({
          body: {
            email: input.email,
            password: input.password,
            name: input.name,
          },
        });

        // Définir le rôle admin
        if (result.user) {
          await prisma.user.update({
            where: { id: result.user.id },
            data: { role: "admin" },
          });
        }

        return { success: true, user: result.user };
      } catch (error) {
        throw new ORPCError("BAD_REQUEST");
      }
    }),
};
