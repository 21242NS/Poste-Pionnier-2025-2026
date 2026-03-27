
import prisma from "@Poste-Pionnier-2025-2026/db";
import { publicProcedure } from "..";
import z from 'zod'

export const ticket = {
    list: publicProcedure.handler(async () => {
        return await prisma.ticket.findMany();
    }),
    create: publicProcedure.input(z.object({ userId: z.string(), description: z.string()})).handler(async ({ input: data }) => {
        return await prisma.ticket.create({ data });
    })
}