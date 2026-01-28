import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL!;
const convex = new ConvexHttpClient(CONVEX_URL);

async function main() {
  const places = await convex.query(api.places.filter, {});
  console.log(`Total places in database: ${places.length}`);
  
  // Count by region
  const byRegion: Record<string, number> = {};
  places.forEach(p => {
    byRegion[p.region] = (byRegion[p.region] || 0) + 1;
  });
  console.log("\nBy region:");
  Object.entries(byRegion).forEach(([r, c]) => console.log(`  ${r}: ${c}`));
  
  // Count by tag
  const googleImported = places.filter(p => p.tags?.includes("google-import")).length;
  console.log(`\nGoogle-imported places: ${googleImported}`);
}

main().catch(console.error);
