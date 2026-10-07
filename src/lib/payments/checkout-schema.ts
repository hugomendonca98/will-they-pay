import * as z from "zod";
import { fieldErrorsFromZod } from "@/lib/leads/schema";
import { ValidationError } from "@/lib/errors";

export const checkoutInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe seu nome (mínimo 2 caracteres).")
    .max(120, "O nome deve ter no máximo 120 caracteres."),
  email: z.email("Informe um e-mail válido."),
});

export type CheckoutInput = z.infer<typeof checkoutInputSchema>;

export function parseCheckoutInput(raw: unknown): CheckoutInput {
  const result = checkoutInputSchema.safeParse(raw);

  if (!result.success) {
    throw new ValidationError(fieldErrorsFromZod(result.error), "Dados inválidos");
  }

  return result.data;
}
