import * as z from "zod";
import { ValidationError } from "@/lib/errors";

const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : undefined));

export const leadInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe seu nome (mínimo 2 caracteres).")
    .max(120, "O nome deve ter no máximo 120 caracteres."),
  email: z.email("Informe um e-mail válido."),
  phone: optionalText.pipe(
    z
      .string()
      .max(20, "O telefone deve ter no máximo 20 caracteres.")
      .regex(/^[\d\s()+-]+$/, "Use apenas números e símbolos de telefone.")
      .optional(),
  ),
  message: optionalText.pipe(
    z.string().max(1000, "A mensagem deve ter no máximo 1000 caracteres.").optional(),
  ),
});

export type LeadInput = z.infer<typeof leadInputSchema>;

export function fieldErrorsFromZod(error: z.ZodError): Record<string, string> {
  const fields: Record<string, string> = {};

  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && fields[key] === undefined) {
      fields[key] = issue.message;
    }
  }

  return fields;
}

export function parseLeadInput(raw: unknown): LeadInput {
  const result = leadInputSchema.safeParse(raw);

  if (!result.success) {
    throw new ValidationError(fieldErrorsFromZod(result.error), "Dados inválidos");
  }

  return result.data;
}
