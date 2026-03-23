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
	addCommand: protectedProcedure.input(addCommandInput).handler(async ({ input, context }) => {
		const created = await prisma.commande.create({
			data: {
				userId: context.session?.user?.id,
                ...input
			},
		});
		return created;
	}),
};
