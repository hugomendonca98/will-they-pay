import { eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { leads } from "@/lib/db/schema";
import { ValidationError } from "@/lib/errors";
import { createLead } from "@/lib/leads/service";
import { createFixedClock, createFixedIds, createTestDb } from "@/test/helpers/db";

describe("createLead", () => {
  it("validates and persists a lead", async () => {
    const db = createTestDb();

    const lead = await createLead(
      {
        name: "  Ana Demo  ",
        email: "Ana.Demo@Example.com",
        phone: "+55 11 99999-0000",
        message: "Quero o plano starter",
      },
      {
        db,
        clock: createFixedClock(),
        ids: createFixedIds("lead-1"),
      },
    );

    expect(lead).toMatchObject({
      id: "lead-1",
      name: "Ana Demo",
      email: "ana.demo@example.com",
      phone: "+55 11 99999-0000",
      message: "Quero o plano starter",
      createdAt: 1_700_000_000_000,
    });

    const stored = await db.select().from(leads).where(eq(leads.id, "lead-1"));
    expect(stored).toHaveLength(1);
    expect(stored[0]?.email).toBe("ana.demo@example.com");
  });

  it("accepts optional phone and message as empty strings", async () => {
    const db = createTestDb();

    const lead = await createLead(
      { name: "Ana Souza", email: "ana@example.com", phone: "  ", message: "" },
      { db, ids: createFixedIds("lead-2") },
    );

    expect(lead.phone).toBeNull();
    expect(lead.message).toBeNull();
  });

  it("rejects invalid payloads without writing rows", async () => {
    const db = createTestDb();

    try {
      await createLead({ name: "H", email: "not-an-email" }, { db });
      throw new Error("expected validation to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect((error as ValidationError).fields).toMatchObject({
        name: expect.any(String),
        email: expect.any(String),
      });
    }

    expect(await db.select().from(leads)).toEqual([]);
  });
});
