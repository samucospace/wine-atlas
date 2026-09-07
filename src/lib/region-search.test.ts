import { describe, expect, it } from "vitest";
import { regions } from "@/data/regions";
import { findRegions } from "./region-search";

describe("findRegions", () => {
  it("finds a region by name, country, grape, or style", () => {
    expect(findRegions(regions, { query: "Marlborough" }).map((region) => region.id)).toEqual(["marlborough"]);
    expect(findRegions(regions, { query: "Argentina" }).map((region) => region.id)).toEqual(["mendoza"]);
    expect(findRegions(regions, { query: "Malbec" }).map((region) => region.id)).toEqual(["mendoza"]);
    expect(findRegions(regions, { query: "sparkling" }).map((region) => region.id)).toEqual(["champagne"]);
  });

  it("composes filters and keeps its input immutable", () => {
    const input = [...regions];
    const matches = findRegions(input, {
      climate: "Warm",
      hemisphere: "Southern",
      sort: "country",
    });

    expect(matches.map((region) => region.id)).toEqual(["barossa-valley"]);
    expect(input).toEqual(regions);
  });
});