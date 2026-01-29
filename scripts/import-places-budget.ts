/**
 * BUDGET-CONSCIOUS Import script (Google Places)
 * Uses ONLY Text Search (no Place Details calls) to keep costs low.
 *
 * Usage:
 *   npx tsx scripts/import-places-budget.ts
 *
 * Notes:
 * - Cost is an ESTIMATE based on Text Search request count.
 * - Hard-stop is enforced by estimated budget.
 */

import { Client } from "@googlemaps/google-maps-services-js";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!GOOGLE_API_KEY || !CONVEX_URL) {
  console.error("❌ Missing env vars (NEXT_PUBLIC_GOOGLE_MAPS_KEY / NEXT_PUBLIC_CONVEX_URL)");
  process.exit(1);
}

const googleClient = new Client({});
const convex = new ConvexHttpClient(CONVEX_URL);

// Budget controls (USD) — user requested cap: $4
const MAX_BUDGET_USD = Number(process.env.IMPORT_MAX_BUDGET_USD ?? "4.00");
const TEXT_SEARCH_COST_ESTIMATE = 0.032; // rough estimate per Text Search request
const MAX_PLACES_PER_CITY = Number(process.env.IMPORT_MAX_PLACES_PER_CITY ?? "15");
const EXISTING_PLACES_FETCH_LIMIT = Number(process.env.IMPORT_EXISTING_LIMIT ?? "5000");
const MIN_EXISTING_PER_CITY = Number(process.env.IMPORT_MIN_EXISTING_PER_CITY ?? "8");

// Cities to search with their regions (expanded list)
// NOTE: We won't necessarily import for ALL cities — we auto-skip cities that already have enough places.
const CITIES: { name: string; region: "north" | "center" | "south" | "jerusalem" | "shfela" }[] = [
  // Center
  { name: "תל אביב", region: "center" },
  { name: "יפו", region: "center" },
  { name: "רמת גן", region: "center" },
  { name: "גבעתיים", region: "center" },
  { name: "בני ברק", region: "center" },
  { name: "פתח תקווה", region: "center" },
  { name: "ראשון לציון", region: "center" },
  { name: "חולון", region: "center" },
  { name: "בת ים", region: "center" },
  { name: "הרצליה", region: "center" },
  { name: "רעננה", region: "center" },
  { name: "כפר סבא", region: "center" },
  { name: "הוד השרון", region: "center" },
  { name: "רמת השרון", region: "center" },
  { name: "ראש העין", region: "center" },
  { name: "נתניה", region: "center" },
  { name: "חדרה", region: "center" },
  { name: "זכרון יעקב", region: "center" },

  // Shfela
  { name: "רחובות", region: "shfela" },
  { name: "נס ציונה", region: "shfela" },
  { name: "יבנה", region: "shfela" },
  { name: "רמלה", region: "shfela" },
  { name: "לוד", region: "shfela" },
  { name: "אשדוד", region: "shfela" },
  { name: "גדרה", region: "shfela" },
  { name: "קריית גת", region: "shfela" },
  { name: "קריית מלאכי", region: "shfela" },

  // South
  { name: "אשקלון", region: "south" },
  { name: "באר שבע", region: "south" },
  { name: "דימונה", region: "south" },
  { name: "ערד", region: "south" },
  { name: "אופקים", region: "south" },
  { name: "נתיבות", region: "south" },
  { name: "שדרות", region: "south" },
  { name: "אילת", region: "south" },

  // Jerusalem area
  { name: "ירושלים", region: "jerusalem" },
  { name: "בית שמש", region: "jerusalem" },
  { name: "מודיעין", region: "jerusalem" },
  { name: "מעלה אדומים", region: "jerusalem" },

  // North
  { name: "חיפה", region: "north" },
  { name: "נשר", region: "north" },
  { name: "קריית אתא", region: "north" },
  { name: "קריית ביאליק", region: "north" },
  { name: "קריית מוצקין", region: "north" },
  { name: "קריית ים", region: "north" },
  { name: "עכו", region: "north" },
  { name: "נהריה", region: "north" },
  { name: "נצרת", region: "north" },
  { name: "טבריה", region: "north" },
  { name: "כרמיאל", region: "north" },
  { name: "עפולה", region: "north" },
  { name: "צפת", region: "north" },
  { name: "יקנעם", region: "north" },
];

let totalCostEstimate = 0;

function normalize(s: string): string {
  return (s ?? "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/["'“”‘’]/g, "")
    .trim();
}

function generateSlug(name: string): string {
  // NOTE: slugs in DB are unique keys. This script uses upsert-by-slug.
  // We keep the existing behavior (random suffix) to avoid collisions with older imported data.
  const translitMap: Record<string, string> = {
    "א": "a",
    "ב": "b",
    "ג": "g",
    "ד": "d",
    "ה": "h",
    "ו": "v",
    "ז": "z",
    "ח": "ch",
    "ט": "t",
    "י": "y",
    "כ": "k",
    "ך": "k",
    "ל": "l",
    "מ": "m",
    "ם": "m",
    "נ": "n",
    "ן": "n",
    "ס": "s",
    "ע": "a",
    "פ": "p",
    "ף": "p",
    "צ": "ts",
    "ץ": "ts",
    "ק": "k",
    "ר": "r",
    "ש": "sh",
    "ת": "t",
  };

  const base = name
    .split("")
    .map((char) => translitMap[char] || char)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `${base}-${Math.random().toString(36).substring(2, 6)}`;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function searchCity(cityName: string): Promise<any[]> {
  console.log(`\n🔍 ${cityName}...`);

  // budget guard BEFORE the request
  if (totalCostEstimate + TEXT_SEARCH_COST_ESTIMATE > MAX_BUDGET_USD) {
    console.log(`⚠️ Budget cap reached (est. $${totalCostEstimate.toFixed(2)}). Stopping before next request.`);
    return [];
  }

  totalCostEstimate += TEXT_SEARCH_COST_ESTIMATE;
  console.log(`   💰 Est. cost so far: $${totalCostEstimate.toFixed(3)} (cap $${MAX_BUDGET_USD.toFixed(2)})`);

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
    return places.slice(0, MAX_PLACES_PER_CITY);
  } catch (error: any) {
    console.error(`   ❌ ${error.message}`);
    return [];
  }
}

function isLikelyShawarmaName(name: string): boolean {
  const n = (name ?? "").toLowerCase();
  return (
    n.includes("שווארמה") ||
    n.includes("שאוורמה") ||
    n.includes("shawarma") ||
    n.includes("shwarma")
  );
}

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
    phone: undefined,
    whatsapp: undefined,
    website: undefined,
    kashrut: "none" as const,
    meatTypes: ["lamb", "turkey"],
    style: ["laffa"],
    priceRange: 2 as const,
    hasDelivery: false,
    hasSeating: true,
    openingHours: undefined,
    images: [],
    avgRating: place.rating || 0,
    reviewCount: place.user_ratings_total || 0,
    isFeatured: false,
    isVerified: false,
    tags: ["google-import", "places-textsearch"],
    createdAt: Date.now(),
  };
}

async function main() {
  console.log("🥙 BUDGET Places Import (Text Search only)");
  console.log("=========================================");
  console.log(`Max budget (estimate): $${MAX_BUDGET_USD.toFixed(2)}`);
  console.log(
    `Estimated cost (upper bound): ${CITIES.length} cities × $${TEXT_SEARCH_COST_ESTIMATE} = $${(
      CITIES.length * TEXT_SEARCH_COST_ESTIMATE
    ).toFixed(2)}`
  );
  console.log(`Max places per city: ${MAX_PLACES_PER_CITY}`);
  console.log(`Min existing per city before we import more: ${MIN_EXISTING_PER_CITY}`);

  // Load existing places to reduce duplicates AND to only import cities that need more coverage
  console.log(`\n📥 Loading existing places (limit ${EXISTING_PLACES_FETCH_LIMIT})...`);
  const existing = (await convex.query(api.places.listAll, {
    limit: EXISTING_PLACES_FETCH_LIMIT,
  })) as any[];

  const existingKeys = new Set<string>();
  const cityCounts: Record<string, number> = {};

  for (const p of existing) {
    const k = `${normalize(p.name)}|${normalize(p.address)}`;
    if (k !== "|") existingKeys.add(k);

    const city = String(p.city || "");
    if (city) cityCounts[city] = (cityCounts[city] || 0) + 1;
  }

  const citiesToImport = CITIES.filter(({ name }) => (cityCounts[name] ?? 0) < MIN_EXISTING_PER_CITY);

  console.log(`   Existing places loaded: ${existingKeys.size}`);
  console.log(`   Cities with enough coverage: ${CITIES.length - citiesToImport.length}/${CITIES.length}`);
  console.log(`   Cities to top-up: ${citiesToImport.length}`);
  console.log(
    `   Estimated cost for this run: ${citiesToImport.length} × $${TEXT_SEARCH_COST_ESTIMATE} = $${(
      citiesToImport.length * TEXT_SEARCH_COST_ESTIMATE
    ).toFixed(2)}`
  );

  let totalImported = 0;
  let totalSkipped = 0;

  const seenGooglePlaceIds = new Set<string>();

  for (const { name: cityName, region } of citiesToImport) {
    const places = await searchCity(cityName);
    if (!places.length) break;

    // Filter noisy results: keep only likely shawarma places
    const filteredPlaces = places.filter((p) => isLikelyShawarmaName(String(p?.name ?? "")));

    for (const place of filteredPlaces) {
      if (place.place_id && seenGooglePlaceIds.has(place.place_id)) {
        totalSkipped++;
        continue;
      }

      const name = place.name || "";
      const address = place.formatted_address || "";
      const key = `${normalize(name)}|${normalize(address)}`;
      if (existingKeys.has(key)) {
        totalSkipped++;
        continue;
      }

      const placeData = transformPlace(place, cityName, region);

      try {
        const result = await convex.mutation(api.placesAdmin.upsertPlace, {
          slug: placeData.slug,
          data: placeData,
        });

        if (place.place_id) seenGooglePlaceIds.add(place.place_id);
        existingKeys.add(key);

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

    await sleep(250);
  }

  console.log("\n=========================================");
  console.log("📊 Summary:");
  console.log(`   ✅ Imported: ${totalImported}`);
  console.log(`   ⏭️ Skipped: ${totalSkipped}`);
  console.log(`   💰 Est. total cost: $${totalCostEstimate.toFixed(2)} (cap $${MAX_BUDGET_USD.toFixed(2)})`);
  console.log("=========================================");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
