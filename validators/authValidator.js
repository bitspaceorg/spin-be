import { z } from "zod";

export const createUserSchema = z.object({
	name: z.string().min(6),
	email: z.string().email(),
	role: z.enum([
		"dean",
		"physician",
		"nurse",
		"administrator",
		"finance_manager",
	]),
	password: z.string().min(8),
});

export const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});
