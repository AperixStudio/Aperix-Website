import { z } from "zod";

export const businessTypeOptions = [
  "Café / Restaurant",
  "Trades / Contractor",
  "Health & Beauty",
  "Professional Services",
  "Retail",
  "Other",
] as const;

export const contactMethodOptions = ["phone", "email"] as const;

const phonePattern = /^[0-9+()\s-]{6,25}$/;

export const contactSchema = z
  .object({
    name: z.string().trim().min(2, "Please enter your full name.").max(100, "Name is too long."),
    email: z
      .string()
      .trim()
      .email("Please enter a valid email address.")
      .max(200, "Email is too long."),
    phone: z
      .string()
      .trim()
      .max(25, "Phone number is too long.")
      .refine((value) => value.length === 0 || phonePattern.test(value), {
        message: "Please enter a valid phone number.",
      }),
    businessName: z
      .string()
      .trim()
      .min(2, "Please enter your business name.")
      .max(120, "Business name is too long."),
    businessType: z
      .string()
      .trim()
      .refine((value) => businessTypeOptions.includes(value as (typeof businessTypeOptions)[number]), {
        message: "Please select your business type.",
      }),
    description: z
      .string()
      .trim()
      .min(20, "Please tell us a little more about your project.")
      .max(2000, "Description is too long."),
    contactMethod: z.enum(contactMethodOptions),
    website: z.string().trim().max(0, "Spam detected.").optional().default(""),
  })
  .superRefine((value, ctx) => {
    if (value.contactMethod === "phone" && value.phone.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["phone"],
        message: "Phone is required if you'd like a call back.",
      });
    }
  });

export type ContactSubmission = z.infer<typeof contactSchema>;
export type ContactFieldName = keyof ContactSubmission;
export type ContactFieldErrors = Partial<Record<ContactFieldName, string>>;

export function toFieldErrors(error: z.ZodError): ContactFieldErrors {
  const flattened = error.flatten().fieldErrors as Record<string, string[] | undefined>;
  const entries = Object.entries(flattened).flatMap(([key, messages]) => {
    const first = Array.isArray(messages) ? messages[0] : undefined;
    return first ? [[key, first] as const] : [];
  });

  return Object.fromEntries(entries) as ContactFieldErrors;
}
