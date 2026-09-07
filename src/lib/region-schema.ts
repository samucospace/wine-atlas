import { z } from "zod";
import { getHemisphere, getLatitudeBelt } from "@/lib/geo";

export const sourceReferenceSchema = z.object({
  title: z.string().trim().min(1),
  publisher: z.string().trim().min(1),
  url: z.url().optional(),
  accessedAt: z.iso.date().optional(),
  license: z.string().trim().min(1).optional(),
  notes: z.string().trim().min(1).optional(),
});

export const regionSchema = z
  .object({
    id: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    name: z.string().trim().min(1),
    country: z.string().trim().min(1),
    countryCode: z.string().trim().length(2).toUpperCase(),
    latitude: z.number().gte(-90).lte(90),
    longitude: z.number().gte(-180).lte(180),
    hemisphere: z.enum(["Northern", "Southern"]),
    latitudeBelt: z.enum(["30-50 N", "30-50 S", "Outside primary belts"]),
    climate: z.enum(["Cool", "Moderate", "Warm", "Hot", "Variable"]),
    landmarks: z.array(z.string().trim().min(1)),
    geographicFactors: z.array(z.string().trim().min(1)),
    climateImpact: z.string().trim().min(1),
    overview: z.string().trim().min(1),
    grapes: z.array(z.string().trim().min(1)),
    styles: z.array(z.string().trim().min(1)),
    sources: z.array(sourceReferenceSchema).min(1),
  })
  .superRefine((region, context) => {
    if (region.hemisphere !== getHemisphere(region.latitude)) {
      context.addIssue({
        code: "custom",
        path: ["hemisphere"],
        message: "Hemisphere must match latitude.",
      });
    }

    if (region.latitudeBelt !== getLatitudeBelt(region.latitude)) {
      context.addIssue({
        code: "custom",
        path: ["latitudeBelt"],
        message: "Latitude belt must match latitude.",
      });
    }
  });

export const regionCatalogueSchema = z.array(regionSchema).superRefine((regions, context) => {
  const regionIds = new Set<string>();

  regions.forEach((region, index) => {
    if (regionIds.has(region.id)) {
      context.addIssue({
        code: "custom",
        path: [index, "id"],
        message: `Duplicate region ID: ${region.id}`,
      });
    }

    regionIds.add(region.id);
  });
});

export function validateRegionCatalogue(input: unknown) {
  return regionCatalogueSchema.parse(input);
}