import { leads, type Lead } from "@/lib/db/schema";
import type { AppDatabase } from "@/lib/db/types";
import { cryptoIdGenerator, systemClock, type Clock, type IdGenerator } from "@/lib/env";
import { parseLeadInput, type LeadInput } from "./schema";

export type CreateLeadDeps = {
  db: AppDatabase;
  clock?: Clock;
  ids?: IdGenerator;
};

export async function createLead(raw: unknown, deps: CreateLeadDeps): Promise<Lead> {
  const input: LeadInput = parseLeadInput(raw);
  const clock = deps.clock ?? systemClock;
  const ids = deps.ids ?? cryptoIdGenerator;
  const now = clock.now();

  const row = {
    id: ids.id(),
    name: input.name,
    email: input.email.toLowerCase(),
    phone: input.phone ?? null,
    message: input.message ?? null,
    createdAt: now,
  };

  await deps.db.insert(leads).values(row);

  return row;
}
