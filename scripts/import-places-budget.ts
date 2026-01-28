/**
 * BUDGET-CONSCIOUS Import script
 * Uses ONLY Text Search (no Place Details calls)
 * Estimated cost: 10 cities × $0.032 = $0.32
 * 
 * Usage: npx tsx scripts/import-places-budget.ts
 */

import { Client } from "@googlemaps/google-maps-services-js";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!GOOGLE_API_KEY || !CONVEX_URL) {
  console.error("❌ Missing env vars");
  process.exit(1);
}

const googleClient = new Client({});
const convex = new ConvexHttpClient(CONVEX_URL);

// BUDGET: Only 10 cities to stay under $3
const CITIES: { name: string; region: "north" | "center" | "south" | "jerusalem" | "shfela" }[] = [
  { name: "תל אביב", region: "center" },
  { name: "חיפה", region: "north" },
  { name: "ירושלים", region: "jerusalem" },
  { name: "באר שבע", region: "south" },
  { name: "ראשון לציון", region: "center" },
  { name: "פתח תקווה", region: "center" },
  { name: "אשדוד", region: "shfela" },
  { name: "נצרת", region: "north" },
  { name: "נתניה", region: "center" },
  { name: "אילת", region: "south" },
];

let totalCost = 0;
const TEXT_SEARCH_COST = 0.032;

function generateSlug(name: string): string {
  const translitMap: Record<string, string> = {
    "א": "a", "ב": "b", "ג": "g", "ד": "d", "ה": "h", "ו": "v",
    "ז": "z", "ח": "ch", "ט": "t", "י": "y", "כ": "k", "ך": "k",
    "ל": "l", "מ": "m", "ם": "m", "נ": "n", "ן": "n", "ס": "s",
    "ע": "a", "פ": "p", "ף": "p", "צ": "ts", "ץ": "ts", "ק": "k",
    "ר": "r", "ש": "sh", "ת": "t",
  };
  
  let slug = name
    .split("")
    .map((char) => translitMap[char] || char)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  
  return `${slug}-${Math.random().toString(36).substring(2, 6)}`;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function searchCity(cityName: string): Promise<any[]> {
  console.log(`🔍 ${cityName}...`);
  totalCost += TEXT_SEARCH_COST;
  console.log(`   💰 Cost so far: $${totalCost.toFixed(3)}`);
  
  try {
    const response = await googleClient.textSearch({
      params: {
        query: `שווארמה ${cityName}`,
        key: GOOGLE_API_KEY!,
        language: "he",
        region: "il",
      },
    });
    
    const places = response.data.results || [];
    console.log(`   Found ${places.length} results`);
    return places.slice(0, 20);
  } catch (error: any) {
    console.error(`   ❌ ${error.message}`);
    return [];
  }
}

// Transform using ONLY Text Search data (no Place Details)
function transformPlace(
  place: any,
  searchedCity: string,
  region: "north" | "center" | "south" | "jerusalem" | "shfela"
) {
  const name = place.name;
  const address = place.formatted_address || "";
  const location = place.geometry?.location;
  
  return {
    name,
    slug: generateSlug(name),
    description: `מסעדת שווארמה ב${searchedCity}`,
    address,
    city: searchedCity,
    region,
    lat: location?.lat || 0,
    lng: location?.lng || 0,
    phone: undefined, // Not available without Place Details
    website: undefined, // Not available without Place Details
    kashrut: "none" as const,
    meatTypes: ["lamb", "turkey"],
    style: ["laffa"],
    priceRange: 2 as const,
    hasDelivery: false,
    hasSeating: true,
    openingHours: undefined, // Not available without Place Details
    images: [],
    avgRating: place.rating || 0,
    reviewCount: place.user_ratings_total || 0,
    isFeatured: false,
    isVerified: false,
    tags: ["google-import"],
    createdAt: Date.now(),
  };
}

const importedPlaceIds = new Set<string>();

async function main() {
  console.log("🥙 BUDGET Import Script");
  console.log("========================");
  console.log(`Max budget: $3.00`);
  console.log(`Estimated cost: ${CITIES.length} cities × $0.032 = $${(CITIES.length * 0.032).toFixed(2)}`);
  console.log("");
  
  let totalImported = 0;
  let totalSkipped = 0;
  
  for (const { name: cityName, region } of CITIES) {
    if (totalCost > 2.50) {
      console.log("⚠️ Approaching budget limit, stopping!");
      break;
    }
    
    const places = await searchCity(cityName, region);
    
    for (const place of places) {
      if (importedPlaceIds.has(place.place_id)) {
        totalSkipped++;
        continue;
      }
      
      const placeData = transformPlace(place, cityName, region);
      
      try {
        const result = await convex.mutation(api.placesAdmin.upsertPlace, {
          slug: placeData.slug,
          data: placeData,
        });
        
        importedPlaceIds.add(place.place_id);
        
        if (result.action === "created") {
          console.log(`   ✅ ${placeData.name}`);
          totalImported++;
        } else {
          totalSkipped++;
        }
      } catch (error: any) {
        console.error(`   ❌ ${placeData.name}: ${error.message}`);
      }
    }
    
    await sleep(200);
  }
  
  console.log("\n========================");
  console.log("📊 Summary:");
  console.log(`   ✅ Imported: ${totalImported}`);
  console.log(`   ⏭️ Skipped: ${totalSkipped}`);
  console.log(`   💰 Total cost: $${totalCost.toFixed(2)}`);
  console.log("========================");
}

main().catch(console.error);
