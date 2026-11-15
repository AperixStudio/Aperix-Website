import { describe, expect, it } from "vitest";
import { buildGenerateLeadParams, buildPageViewParams } from "./analytics";

describe("buildGenerateLeadParams", () => {
  it("sends only the non-identifying enquiry fields", () => {
    const params = buildGenerateLeadParams({
      pagePath: "/contact",
      leadNeed: "New website",
      leadTiming: "ASAP",
      preferCall: true,
    });

    expect(params).toEqual({
      form_id: "contact_briefing",
      page_path: "/contact",
      lead_need: "New website",
      lead_timing: "ASAP",
      prefer_call: true,
    });
    expect(Object.keys(params).sort()).toEqual([
      "form_id",
      "lead_need",
      "lead_timing",
      "page_path",
      "prefer_call",
    ]);
  });
});

describe("buildPageViewParams", () => {
  it("keeps the query string out of the page location", () => {
    expect(buildPageViewParams("https://aperix.com.au", "/services")).toEqual({
      page_path: "/services",
      page_location: "https://aperix.com.au/services",
      send_to: "G-7ZB0J7JTHC",
    });
  });
});
