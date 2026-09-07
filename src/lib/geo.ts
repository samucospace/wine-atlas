import type { Hemisphere, LatitudeBelt } from "@/types/region";

export function getHemisphere(latitude: number): Hemisphere {
  return latitude >= 0 ? "Northern" : "Southern";
}

export function getLatitudeBelt(latitude: number): LatitudeBelt {
  const absoluteLatitude = Math.abs(latitude);

  if (absoluteLatitude < 30 || absoluteLatitude > 50) {
    return "Outside primary belts";
  }

  return latitude >= 0 ? "30-50 N" : "30-50 S";
}