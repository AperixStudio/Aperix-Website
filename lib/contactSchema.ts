import { z } from "zod";

export const needOptions = ["New website", "Mobile app", "Custom software", "Other"] as const;

export const timingOptions = ["ASAP", "This quarter", "Just looking"] as const;

const phonePattern = /^[0-9+()\s-]{6,25}$/;

export const contactSchema = z.object({
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
  need: z.enum(needOptions, { message: "Please choose what you need." }),
  timing: z.enum(timingOptions, { message: "Please choose when you want to start." }),
  website: z.string().trim().max(0, "Spam detected.").optional().default(""),
});

export type NeedOption = (typeof needOptions)[number];
export type TimingOption = (typeof timingOptions)[number];
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
