import { regions } from "@/data/regions";
import { validateRegionCatalogue } from "@/lib/region-schema";

const validatedRegions = validateRegionCatalogue(regions);

console.log(`Validated ${validatedRegions.length} Wine Atlas regions.`);