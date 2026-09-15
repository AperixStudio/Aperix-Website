import { describe, expect, it } from "vitest";
import { contactSchema } from "./contactSchema";

describe("contactSchema", () => {
  const validPayload = {
    name: "Harrison Knight",
    email: "hello@example.com",
    phone: "",
    need: "New website" as const,
    timing: "ASAP" as const,
    website: "",
  };

  it("accepts a valid enquiry", () => {
    const result = contactSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("accepts an optional phone number", () => {
    const result = contactSchema.safeParse({
      ...validPayload,
      phone: "0412 345 678",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an invalid need", () => {
    const result = contactSchema.safeParse({
      ...validPayload,
      need: "Rebuild a site",
    });

    expect(result.success).toBe(false);
  });

  it("rejects spam through the honeypot field", () => {
    const result = contactSchema.safeParse({
      ...validPayload,
      website: "https://spam.example",
    });

    expect(result.success).toBe(false);
  });
});
