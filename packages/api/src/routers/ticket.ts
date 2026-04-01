import prisma from "@Poste-Pionnier-2025-2026/db";
import { ORPCError } from "@orpc/server";
import { protectedProcedure } from "..";
import z from "zod";

export const ticket = {
  list: protectedProcedure.handler(async ({ context }) => {
    const currentUser = await prisma.user.findUnique({
      where: { id: context.session.user.id },
      select: { role: true },
    });

    if (!currentUser) {
      throw new ORPCError("UNAUTHORIZED");
    }

    if (currentUser.role === "admin") {
      return await prisma.ticket.findMany({
        orderBy: { createdAt: "desc" },
      });
    }

    return await prisma.ticket.findMany({
      where: { userId: context.session.user.id },
      orderBy: { createdAt: "desc" },
    });
  }),

  create: protectedProcedure
    .input(z.object({ description: z.string() }))
    .handler(async ({ input, context }) => {
      return await prisma.ticket.create({
        data: {
          description: input.description,
          userId: context.session.user.id,
        },
      });
    }),
};
