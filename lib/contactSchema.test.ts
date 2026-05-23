import { describe, expect, it } from "vitest";
import { contactSchema } from "./contactSchema";

describe("contactSchema", () => {
  const validPayload = {
    name: "Harrison Knight",
    email: "hello@example.com",
    phone: "0412 345 678",
    businessName: "Aperix Studio",
    businessType: "Professional Services",
    description: "We need a fast custom website that converts more local enquiries.",
    contactMethod: "email" as const,
    website: "",
  };

  it("accepts a valid enquiry", () => {
    const result = contactSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("requires a phone number for call-backs", () => {
    const result = contactSchema.safeParse({
      ...validPayload,
      phone: "",
      contactMethod: "phone" as const,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.phone?.[0]).toContain("Phone is required");
    }
  });

  it("rejects spam through the honeypot field", () => {
    const result = contactSchema.safeParse({
      ...validPayload,
      website: "https://spam.example",
    });

    expect(result.success).toBe(false);
  });
});
