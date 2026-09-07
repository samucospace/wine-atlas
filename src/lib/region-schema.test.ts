import { describe, expect, it } from "vitest";
import { regions } from "@/data/regions";
import { validateRegionCatalogue } from "./region-schema";

describe("validateRegionCatalogue", () => {
  it("accepts the shipped regional catalogue", () => {
    expect(validateRegionCatalogue(regions)).toHaveLength(regions.length);
  });

  it("rejects duplicate identifiers and inconsistent latitude metadata", () => {
    const invalidRegions = [
      ...regions,
      {
        ...regions[0],
        hemisphere: "Southern" as const,
      },
    ];

    expect(() => validateRegionCatalogue(invalidRegions)).toThrow(/Hemisphere|Duplicate/);
  });
});