import {
  contactSchema,
  needOptions,
  timingOptions,
  toFieldErrors,
  type ContactFieldErrors,
  type NeedOption,
} from "./contactSchema";

export const BRIEFING_STEP_COUNT = 4;
export const WEBSITE_TIER_NEED: NeedOption = "New website";

export const briefingQuestions = [
  "What do you need?",
  "When do you want to start?",
  "Your name",
  "Best email",
] as const;

export type BriefingStep = 0 | 1 | 2 | 3;

export type BriefingDraft = {
  step: BriefingStep;
  need: string;
  timing: string;
  name: string;
  email: string;
  phone: string;
  preferCall: boolean;
  website: string;
};

export const emptyBriefingDraft: BriefingDraft = {
  step: 0,
  need: "",
  timing: "",
  name: "",
  email: "",
  phone: "",
  preferCall: false,
  website: "",
};

export function needFromTierParam(tier: string | null | undefined): NeedOption | null {
  if (!tier?.trim()) {
    return null;
  }

  return WEBSITE_TIER_NEED;
}

export function validateBriefingStep(
  step: BriefingStep,
  draft: BriefingDraft,
): ContactFieldErrors {
  if (step === 0) {
    const parsed = contactSchema.pick({ need: true }).safeParse({ need: draft.need });
    return parsed.success ? {} : toFieldErrors(parsed.error);
  }

  if (step === 1) {
    const parsed = contactSchema.pick({ timing: true }).safeParse({ timing: draft.timing });
    return parsed.success ? {} : toFieldErrors(parsed.error);
  }

  if (step === 2) {
    const parsed = contactSchema.pick({ name: true }).safeParse({ name: draft.name });
    return parsed.success ? {} : toFieldErrors(parsed.error);
  }

  const parsed = contactSchema
    .pick({ email: true, phone: true })
    .safeParse({ email: draft.email, phone: draft.phone });
  const errors = parsed.success ? {} : toFieldErrors(parsed.error);

  if (draft.preferCall && draft.phone.trim().length === 0) {
    errors.phone = "Phone is required if you'd like a call back.";
  }

  return errors;
}

export { needOptions, timingOptions };
