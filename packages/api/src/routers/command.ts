import { z } from "zod";

import prisma from "@Poste-Pionnier-2025-2026/db";

import { protectedProcedure } from "../index";

const addCommandInput = z.object({
	role: z.enum(["PARENT_ANIMEE", "ANIMEE", "ANIMATEUR", "ADMIN", "EXTERN"]),
	email: z.string().email(),
	section: z.enum([
		"BALADIN",
		"MEUTE_SEEONEE",
		"MEUTE_DU_PEUPLE_LIBRE",
		"TROUPE_DU_GRAND_VENEUR_GOELAND",
	]),
	name: z.string().min(1),
	sandwichChoice: z.enum([
		"POULET_CURRY",
		"HOUMOUS",
		"CLUB_JAMBON_FROMAGE",
		"JAMBON",
		"FROMAGE",
		"THON",
	]),
	tomato: z.boolean().optional(),
	lettuce: z.boolean().optional(),
	cucumber: z.boolean().optional(),
	sauce: z.enum(["MAYONNAISE", "KETCHUP", "NONE"]),
	juice: z.enum(["ORANGE", "POMME"]),
	remark: z.string().max(500).optional(),
	payment: z.boolean().optional(),
});
export const commandRouter = {
	list : protectedProcedure.handler(async ({ context }) => {
		const currentUser = await prisma.user.findUnique({
			where: { id: context.session.user.id },
			select: { role: true },
		});

		if (!currentUser) {
			throw new Error("Unauthorized");
		}

		if (currentUser.role === "admin") {
			return await prisma.commande.findMany({
				orderBy: { createdAt: "desc" },
			});
		}

		return await prisma.commande.findMany({
			where: { userId: context.session.user.id },
			orderBy: { createdAt: "desc" },
		});
	}),
	addCommand: protectedProcedure.input(addCommandInput).handler(async ({ input, context }) => {
		const created = await prisma.commande.create({
			data: {
				userId: context.session?.user?.id,
                ...input
			},
		});
		return created;
	}),
	deleteCommand: protectedProcedure.input(z.object({ id: z.string() })).handler(async ({ input, context }) => {
		const deleted = await prisma.commande.delete({
			where: {
				id: input.id,
			},
		});
		return deleted;
	}),
	updateCommand: protectedProcedure.input(z.object({ id: z.string(), data: addCommandInput })).handler(async ({ input, context }) => {
		const updated = await prisma.commande.update({
			where: {
				id: input.id,
			},
			data: {
				...input.data
			},
		});
		return updated;
	}),
};
