#!/usr/bin/env npx tsx
/**
 * Fast Google Places API Import for ShawarmaBis
 * Budget-limited: stops at $2
 * 
 * Usage: npx tsx scripts/fast-import.ts
 */

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
const OUTPUT_FILE = path.join(__dirname, "output", "scraped-places.json");

if (!GOOGLE_API_KEY) {
  console.error("❌ Missing NEXT_PUBLIC_GOOGLE_MAPS_KEY");
  process.exit(1);
}

// Budget tracking
const COST_PER_TEXT_SEARCH = 0.032; // $0.032 per Text Search request
const MAX_BUDGET = 2.0; // $2 limit
let totalCost = 0;
let totalPlaces = 0;

// Cities to search
const CITIES = [
  // Skip cities we already have good coverage for from scraping
  { name: "לוד", region: "center" },
  { name: "רמלה", region: "center" },
  { name: "יבנה", region: "shfela" },
  { name: "נס ציונה", region: "shfela" },
  { name: "רחובות", region: "shfela" },
  { name: "גדרה", region: "shfela" },
  { name: "קריית אתא", region: "north" },
  { name: "קריית מוצקין", region: "north" },
  { name: "עפולה", region: "north" },
  { name: "נהריה", region: "north" },
  { name: "צפת", region: "north" },
  { name: "כרמיאל", region: "north" },
  { name: "אשקלון", region: "shfela" },
  { name: "קריית גת", region: "shfela" },
  { name: "שדרות", region: "south" },
  { name: "ערד", region: "south" },
  { name: "אופקים", region: "south" },
  { name: "אריאל", region: "jerusalem" },
  { name: "מעלה אדומים", region: "jerusalem" },
  { name: "ביתר עילית", region: "jerusalem" },
];

interface Place {
  name: string;
  slug: string;
  description: string;
  address: string;
  city: string;
  region: string;
  lat: number;
  lng: number;
  phone?: string;
  website?: string;
  kashrut: string;
  meatTypes: string[];
  style: string[];
  priceRange: number;
  hasDelivery: boolean;
  hasSeating: boolean;
  images: string[];
  avgRating: number;
  reviewCount: number;
  isFeatured: boolean;
  isVerified: boolean;
  tags: string[];
  createdAt: number;
}

// Hebrew transliteration for slugs
function generateSlug(name: string, city: string): string {
  const translitMap: Record<string, string> = {
    "א": "", "ב": "b", "ג": "g", "ד": "d", "ה": "h", "ו": "v",
    "ז": "z", "ח": "ch", "ט": "t", "י": "y", "כ": "k", "ך": "k",
    "ל": "l", "מ": "m", "ם": "m", "נ": "n", "ן": "n", "ס": "s",
    "ע": "a", "פ": "p", "ף": "f", "צ": "ts", "ץ": "ts", "ק": "k",
    "ר": "r", "ש": "sh", "ת": "t",
  };
  
  const transliterate = (str: string) => str
    .split("")
    .map((char) => translitMap[char] ?? (char.match(/[a-zA-Z0-9]/) ? char.toLowerCase() : ""))
    .join("")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  
  const nameSlug = transliterate(name);
  const citySlug = transliterate(city);
  
  if (!nameSlug) return `shawarma-${citySlug}-${Date.now()}`;
  return `${nameSlug}-${citySlug}`;
}

async function searchPlaces(query: string): Promise<any> {
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}&language=he&region=il`;
  
  const response = await fetch(url);
  totalCost += COST_PER_TEXT_SEARCH;
  
  return response.json();
}

async function getPlaceDetails(placeId: string): Promise<any> {
  // Using only basic fields to minimize cost (Basic fields are free with Place Search)
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=formatted_phone_number,website,opening_hours&key=${GOOGLE_API_KEY}&language=he`;
  
  const response = await fetch(url);
  // Place Details costs $0.017 for basic fields
  totalCost += 0.017;
  
  return response.json();
}

async function main() {
  console.log("╔══════════════════════════════════════════╗");
  console.log("║  🥙 ShawarmaBis - Fast API Import        ║");
  console.log("╚══════════════════════════════════════════╝");
  console.log(`\n💰 Budget: $${MAX_BUDGET.toFixed(2)}`);
  console.log(`📍 Cities: ${CITIES.length}\n`);

  // Load existing places
  let allPlaces: Place[] = [];
  if (fs.existsSync(OUTPUT_FILE)) {
    try {
      allPlaces = JSON.parse(fs.readFileSync(OUTPUT_FILE, "utf-8"));
      console.log(`📂 Loaded ${allPlaces.length} existing places\n`);
    } catch {
      console.log("⚠️ Could not load existing places\n");
    }
  }

  const existingSlugs = new Set(allPlaces.map(p => p.slug));

  for (const city of CITIES) {
    if (totalCost >= MAX_BUDGET) {
      console.log(`\n🛑 Budget limit reached ($${totalCost.toFixed(3)})`);
      break;
    }

    console.log(`\n🏙️ ${city.name} (${city.region})`);
    console.log(`   💰 Cost so far: $${totalCost.toFixed(3)}`);

    try {
      const result = await searchPlaces(`שווארמה ${city.name}`);
      
      if (result.status !== "OK" || !result.results) {
        console.log(`   ⚠️ No results (${result.status})`);
        continue;
      }

      const places = result.results.slice(0, 10); // Max 10 per city
      console.log(`   📍 Found ${places.length} places`);

      for (const place of places) {
        if (totalCost >= MAX_BUDGET) break;

        const name = place.name;
        const slug = generateSlug(name, city.name);
        
        // Skip duplicates
        if (existingSlugs.has(slug)) {
          continue;
        }

        const newPlace: Place = {
          name,
          slug,
          description: `${name} - מקום שווארמה ב${city.name}${place.rating ? ` עם דירוג ${place.rating}` : ""}.`,
          address: place.formatted_address || city.name,
          city: city.name,
          region: city.region,
          lat: place.geometry?.location?.lat || 0,
          lng: place.geometry?.location?.lng || 0,
          kashrut: "none",
          meatTypes: ["mixed"],
          style: ["laffa", "pita"],
          priceRange: place.price_level || 2,
          hasDelivery: false,
          hasSeating: true,
          images: place.photos?.slice(0, 3).map((p: any) => 
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${p.photo_reference}&key=${GOOGLE_API_KEY}`
          ) || [],
          avgRating: place.rating || 0,
          reviewCount: place.user_ratings_total || 0,
          isFeatured: (place.rating || 0) >= 4.5,
          isVerified: false,
          tags: ["שווארמה", city.name, ...(place.rating >= 4.5 ? ["top-rated", "מומלץ"] : [])],
          createdAt: Date.now(),
        };

        allPlaces.push(newPlace);
        existingSlugs.add(slug);
        totalPlaces++;
        console.log(`   ✅ ${name} (${place.rating || 0}⭐)`);
      }

      // Small delay to be nice to the API
      await new Promise(r => setTimeout(r, 100));

    } catch (err) {
      console.log(`   ❌ Error: ${err}`);
    }
  }

  // Save results
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allPlaces, null, 2), "utf-8");

  console.log("\n╔══════════════════════════════════════════╗");
  console.log("║  📊 Import Complete!                      ║");
  console.log("╚══════════════════════════════════════════╝");
  console.log(`\n✅ New places added: ${totalPlaces}`);
  console.log(`📍 Total places: ${allPlaces.length}`);
  console.log(`💰 Total cost: $${totalCost.toFixed(3)}`);
  console.log(`📁 Saved to: ${OUTPUT_FILE}`);
}

main().catch(console.error);
