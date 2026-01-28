/**
 * Import shawarma places from Google Places API into Convex
 * Usage: npx tsx scripts/import-places.ts
 */

import { Client, PlaceInputType } from "@googlemaps/google-maps-services-js";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

// Load environment variables
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!GOOGLE_API_KEY) {
  console.error("❌ Missing NEXT_PUBLIC_GOOGLE_MAPS_KEY in .env.local");
  process.exit(1);
}

if (!CONVEX_URL) {
  console.error("❌ Missing NEXT_PUBLIC_CONVEX_URL in .env.local");
  process.exit(1);
}

const googleClient = new Client({});
const convex = new ConvexHttpClient(CONVEX_URL);

// Cities to search with their regions
const CITIES: { name: string; region: "north" | "center" | "south" | "jerusalem" | "shfela" }[] = [
  // Center
  { name: "תל אביב", region: "center" },
  { name: "פתח תקווה", region: "center" },
  { name: "ראשון לציון", region: "center" },
  { name: "חולון", region: "center" },
  { name: "בני ברק", region: "center" },
  { name: "נתניה", region: "center" },
  // North
  { name: "חיפה", region: "north" },
  { name: "נצרת", region: "north" },
  { name: "עכו", region: "north" },
  { name: "כרמיאל", region: "north" },
  { name: "טבריה", region: "north" },
  // Jerusalem area
  { name: "ירושלים", region: "jerusalem" },
  // Shfela
  { name: "אשדוד", region: "shfela" },
  // South
  { name: "באר שבע", region: "south" },
  { name: "אילת", region: "south" },
  { name: "דימונה", region: "south" },
];

// Generate slug from Hebrew name
function generateSlug(name: string): string {
  // Transliterate common Hebrew letters
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
  
  // Add random suffix to ensure uniqueness
  const suffix = Math.random().toString(36).substring(2, 6);
  return `${slug}-${suffix}`;
}

// Sleep helper
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Search for shawarma places in a city
async function searchCity(cityName: string, region: string): Promise<any[]> {
  console.log(`\n🔍 Searching: שווארמה ${cityName}...`);
  
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
    return places.slice(0, 20); // Limit to 20 per city
  } catch (error: any) {
    console.error(`   ❌ Error searching ${cityName}:`, error.message);
    return [];
  }
}

// Get place details
async function getPlaceDetails(placeId: string): Promise<any> {
  try {
    const response = await googleClient.placeDetails({
      params: {
        place_id: placeId,
        key: GOOGLE_API_KEY!,
        language: "he",
        fields: [
          "name",
          "formatted_address",
          "formatted_phone_number",
          "international_phone_number",
          "website",
          "opening_hours",
          "rating",
          "user_ratings_total",
          "geometry",
          "photos",
          "types",
        ],
      },
    });
    return response.data.result;
  } catch (error: any) {
    console.error(`   ⚠️ Error getting details:`, error.message);
    return null;
  }
}

// Extract city from address
function extractCity(address: string, searchedCity: string): string {
  // Try to find the searched city in the address
  if (address.includes(searchedCity)) {
    return searchedCity;
  }
  
  // Common patterns in Israeli addresses
  const cities = [
    "תל אביב", "חיפה", "ירושלים", "באר שבע", "נתניה", "אשדוד",
    "פתח תקווה", "ראשון לציון", "חולון", "בני ברק", "נצרת",
    "עכו", "כרמיאל", "טבריה", "אילת", "דימונה", "רמת גן",
    "גבעתיים", "הרצליה", "רעננה", "כפר סבא", "רמת השרון",
    "מודיעין", "אשקלון", "לוד", "רמלה", "יפו", "יבנה",
  ];
  
  for (const city of cities) {
    if (address.includes(city)) {
      return city;
    }
  }
  
  return searchedCity; // Default to searched city
}

// Transform Google Place to Convex schema
function transformPlace(
  place: any,
  details: any,
  searchedCity: string,
  region: "north" | "center" | "south" | "jerusalem" | "shfela"
) {
  const name = details?.name || place.name;
  const address = details?.formatted_address || place.formatted_address || "";
  const city = extractCity(address, searchedCity);
  
  // Get coordinates
  const location = details?.geometry?.location || place.geometry?.location;
  const lat = location?.lat || 0;
  const lng = location?.lng || 0;
  
  // Get rating
  const rating = details?.rating || place.rating || 0;
  
  return {
    name,
    slug: generateSlug(name),
    description: `מסעדת שווארמה ב${city}`,
    address,
    city,
    region,
    lat,
    lng,
    phone: details?.formatted_phone_number || details?.international_phone_number,
    website: details?.website,
    kashrut: "none" as const,
    meatTypes: ["lamb", "turkey"],
    style: ["laffa"],
    priceRange: 2 as const,
    hasDelivery: false,
    hasSeating: true,
    openingHours: details?.opening_hours?.weekday_text,
    images: [],
    avgRating: rating,
    reviewCount: details?.user_ratings_total || 0,
    isFeatured: false,
    isVerified: false,
    tags: ["google-import"],
    createdAt: Date.now(),
  };
}

// Keep track of imported places to avoid duplicates
const importedNames = new Set<string>();

async function main() {
  console.log("🥙 Shawarma Places Import Script");
  console.log("================================");
  console.log(`Google API Key: ${GOOGLE_API_KEY?.substring(0, 10)}...`);
  console.log(`Convex URL: ${CONVEX_URL}`);
  
  let totalImported = 0;
  let totalSkipped = 0;
  let totalErrors = 0;
  
  for (const { name: cityName, region } of CITIES) {
    const places = await searchCity(cityName, region);
    
    for (const place of places) {
      // Skip if we've already processed this place
      const placeKey = `${place.name}|${place.place_id}`;
      if (importedNames.has(placeKey)) {
        console.log(`   ⏭️ Skipping duplicate: ${place.name}`);
        totalSkipped++;
        continue;
      }
      
      // Get detailed info
      await sleep(100); // Rate limiting
      const details = await getPlaceDetails(place.place_id);
      
      if (!details) {
        totalErrors++;
        continue;
      }
      
      // Transform and import
      const placeData = transformPlace(place, details, cityName, region);
      
      try {
        const result = await convex.mutation(api.placesAdmin.upsertPlace, {
          slug: placeData.slug,
          data: placeData,
        });
        
        importedNames.add(placeKey);
        
        if (result.action === "created") {
          console.log(`   ✅ Imported: ${placeData.name} (${placeData.city})`);
          totalImported++;
        } else {
          console.log(`   🔄 Updated: ${placeData.name} (${placeData.city})`);
          totalSkipped++;
        }
      } catch (error: any) {
        console.error(`   ❌ Failed to import ${placeData.name}:`, error.message);
        totalErrors++;
      }
      
      // Rate limit to avoid Google API quota issues
      await sleep(200);
    }
    
    // Pause between cities
    await sleep(500);
  }
  
  console.log("\n================================");
  console.log("📊 Import Summary:");
  console.log(`   ✅ Imported: ${totalImported}`);
  console.log(`   ⏭️ Skipped/Updated: ${totalSkipped}`);
  console.log(`   ❌ Errors: ${totalErrors}`);
  console.log("================================");
  console.log("\n📝 Don't forget to add attribution: \"מידע עסקי מ-Google\"");
}

main().catch(console.error);
