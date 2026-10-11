export type LeadFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fields?: Record<string, string>;
};

export const initialLeadFormState: LeadFormState = { status: "idle" };
