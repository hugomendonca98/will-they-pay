"use server";

import { getDb } from "@/lib/db/client";
import { ValidationError } from "@/lib/errors";
import type { LeadFormState } from "@/app/actions/lead-state";
import { createLead } from "@/lib/leads/service";

export async function submitLead(
  _prev: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  try {
    const db = await getDb();
    await createLead(
      {
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        message: String(formData.get("message") ?? ""),
      },
      { db },
    );

    return {
      status: "success",
      message: "Recebemos seus dados. Entraremos em contato em breve.",
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      return {
        status: "error",
        message: "Revise os campos destacados e tente novamente.",
        fields: error.fields,
      };
    }

    console.error("Failed to save lead", error);
    return {
      status: "error",
      message: "Não foi possível salvar seus dados agora. Tente novamente em instantes.",
    };
  }
}
