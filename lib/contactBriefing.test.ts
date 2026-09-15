import { describe, expect, it } from "vitest";
import {
  needFromTierParam,
  validateBriefingStep,
  emptyBriefingDraft,
} from "./contactBriefing";

describe("needFromTierParam", () => {
  it("maps website package tiers to New website", () => {
    expect(needFromTierParam("Growth")).toBe("New website");
    expect(needFromTierParam("Pro")).toBe("New website");
  });

  it("ignores an empty tier", () => {
    expect(needFromTierParam(null)).toBeNull();
    expect(needFromTierParam("")).toBeNull();
  });
});

describe("validateBriefingStep", () => {
  it("requires a need on the first step", () => {
    const errors = validateBriefingStep(0, emptyBriefingDraft);
    expect(errors.need).toBeTruthy();
  });

  it("accepts a chosen need on the first step", () => {
    const errors = validateBriefingStep(0, {
      ...emptyBriefingDraft,
      need: "New website",
    });
    expect(errors).toEqual({});
  });

  it("requires a phone number when a call is requested", () => {
    const errors = validateBriefingStep(3, {
      ...emptyBriefingDraft,
      email: "hello@example.com",
      preferCall: true,
      phone: "",
    });

    expect(errors.phone).toContain("Phone is required");
  });
});
