#!/usr/bin/env npx tsx
/**
 * Add Google Photos to Imported Places — ShawarmaBis
 *
 * Fetches photos from Google Places API for places with "google-import" tag
 * and saves them locally.
 *
 * Usage:
 *   npx tsx scripts/add-photos.ts [--dry-run] [--limit N]
 *
 * Budget tracking:
 *   - Text Search: $0.017 per request
 *   - Place Details: $0.017 per request
 *   - Photos: $0.007 per request
 *   Target: STAY UNDER $4.40 THIS RUN
 */

import * as fs from "fs";
import * as path from "path";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

// ─── Configuration ──────────────────────────────────────────────────────────

const PHOTO_WIDTH = 400; // pixels
const OUTPUT_DIR = path.join(__dirname, "..", "public", "places");

// Google Places API costs
const COST_TEXT_SEARCH = 0.017;
const COST_PLACE_DETAILS = 0.017;
const COST_PHOTO = 0.007;

// ─── Cost Tracker ───────────────────────────────────────────────────────────

interface CostTracker {
  textSearchCount: number;
  placeDetailsCount: number;
  photoCount: number;
}

function calculateCost(tracker: CostTracker): {
  textSearch: number;
  placeDetails: number;
  photos: number;
  total: number;
} {
  const textSearch = tracker.textSearchCount * COST_TEXT_SEARCH;
  const placeDetails = tracker.placeDetailsCount * COST_PLACE_DETAILS;
  const photos = tracker.photoCount * COST_PHOTO;
  return {
    textSearch,
    placeDetails,
    photos,
    total: textSearch + placeDetails + photos,
  };
}

// ─── Utility ────────────────────────────────────────────────────────────────

function log(msg: string): void {
  const timestamp = new Date().toISOString().slice(11, 19);
  console.log(`[${timestamp}] ${msg}`);
}

function loadEnvFile(): Record<string, string> {
  const envPaths = [
    path.join(__dirname, "..", ".env.local"),
    path.join(__dirname, "..", ".env"),
  ];

  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      const env: Record<string, string> = {};
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx === -1) continue;
        const key = trimmed.slice(0, eqIdx).trim();
        let value = trimmed.slice(eqIdx + 1).trim();
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }
        env[key] = value;
      }
      return env;
    }
  }
  return {};
}

function getEnvVar(name: string): string {
  if (process.env[name]) return process.env[name]!;
  const env = loadEnvFile();
  if (env[name]) return env[name];
  throw new Error(`${name} not found in environment or .env.local`);
}

// ─── Google Places API ──────────────────────────────────────────────────────

interface PlaceSearchResult {
  place_id: string;
  name: string;
}

interface PlacePhoto {
  photo_reference: string;
  height: number;
  width: number;
}

interface PlaceDetailsResult {
  photos?: PlacePhoto[];
}

async function searchPlace(
  apiKey: string,
  query: string,
  tracker: CostTracker
): Promise<PlaceSearchResult | null> {
  const url = new URL("https://maps.googleapis.com/maps/api/place/textsearch/json");
  url.searchParams.set("query", query);
  url.searchParams.set("key", apiKey);
  url.searchParams.set("language", "he");

  const response = await fetch(url.toString());
  tracker.textSearchCount++;

  if (!response.ok) {
    throw new Error(`Text Search failed: ${response.status}`);
  }

  const data = await response.json();
  if (data.results && data.results.length > 0) {
    return {
      place_id: data.results[0].place_id,
      name: data.results[0].name,
    };
  }
  return null;
}

async function getPlaceDetails(
  apiKey: string,
  placeId: string,
  tracker: CostTracker
): Promise<PlaceDetailsResult | null> {
  const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  url.searchParams.set("place_id", placeId);
  url.searchParams.set("fields", "photos");
  url.searchParams.set("key", apiKey);

  const response = await fetch(url.toString());
  tracker.placeDetailsCount++;

  if (!response.ok) {
    throw new Error(`Place Details failed: ${response.status}`);
  }

  const data = await response.json();
  return data.result || null;
}

async function downloadPhoto(
  apiKey: string,
  photoRef: string,
  outputPath: string,
  tracker: CostTracker
): Promise<boolean> {
  const url = new URL("https://maps.googleapis.com/maps/api/place/photo");
  url.searchParams.set("photo_reference", photoRef);
  url.searchParams.set("maxwidth", PHOTO_WIDTH.toString());
  url.searchParams.set("key", apiKey);

  const response = await fetch(url.toString());
  tracker.photoCount++;

  if (!response.ok) {
    return false;
  }

  const buffer = await response.arrayBuffer();
  fs.writeFileSync(outputPath, Buffer.from(buffer));
  return true;
}

// ─── Parse Args ─────────────────────────────────────────────────────────────

function parseArgs(): { dryRun: boolean; limit: number } {
  const args = process.argv.slice(2);
  let dryRun = false;
  let limit = 999;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--dry-run") {
      dryRun = true;
    }
    if (args[i] === "--limit" && args[i + 1]) {
      limit = parseInt(args[i + 1], 10);
      i++;
    }
  }

  return { dryRun, limit };
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const { dryRun, limit } = parseArgs();

  console.log("╔══════════════════════════════════════════════╗");
  console.log("║  📸 ShawarmaBis - Add Google Photos           ║");
  console.log("╚══════════════════════════════════════════════╝");
  console.log();

  if (dryRun) {
    log("🏷️  DRY RUN MODE — no API calls or changes");
  }

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Load API keys
  const googleApiKey = getEnvVar("NEXT_PUBLIC_GOOGLE_MAPS_KEY");
  const convexUrl = getEnvVar("NEXT_PUBLIC_CONVEX_URL");

  log(`🔗 Connecting to Convex: ${convexUrl}`);
  const client = new ConvexHttpClient(convexUrl);

  // Get all places with "google-import" tag
  log("📂 Fetching places with google-import tag...");
  const allPlaces = await client.query(api.places.listByTag, { tag: "google-import" });

  // Filter to only those without images
  const placesNeedingPhotos = allPlaces.filter(
    (p: any) => !p.images || p.images.length === 0
  );

  log(`📊 Found ${allPlaces.length} google-import places`);
  log(`📷 ${placesNeedingPhotos.length} need photos (empty images array)`);

  if (placesNeedingPhotos.length === 0) {
    log("✅ All places already have photos!");
    return;
  }

  // Limit places to process
  const toProcess = placesNeedingPhotos.slice(0, limit);
  log(`🔄 Processing ${toProcess.length} places (limit: ${limit})`);
  console.log();

  // Cost tracker
  const tracker: CostTracker = {
    textSearchCount: 0,
    placeDetailsCount: 0,
    photoCount: 0,
  };

  let photosAdded = 0;
  let photosSkipped = 0;
  let errors = 0;

  for (let i = 0; i < toProcess.length; i++) {
    const place = toProcess[i];
    const prefix = `[${i + 1}/${toProcess.length}]`;

    // Progress logging every 20 places
    if (i > 0 && i % 20 === 0) {
      const cost = calculateCost(tracker);
      log(`📊 Progress: ${i}/${toProcess.length} | Cost so far: $${cost.total.toFixed(2)}`);
    }

    try {
      if (dryRun) {
        log(`${prefix} Would process: "${place.name}" (${place.city})`);
        photosAdded++;
        continue;
      }

      // Search for place in Google
      const searchQuery = `${place.name} שווארמה ${place.city}`;
      const searchResult = await searchPlace(googleApiKey, searchQuery, tracker);

      if (!searchResult) {
        log(`${prefix} ⚠️  Not found: "${place.name}"`);
        photosSkipped++;
        continue;
      }

      // Get place details with photos
      const details = await getPlaceDetails(googleApiKey, searchResult.place_id, tracker);

      if (!details?.photos || details.photos.length === 0) {
        log(`${prefix} ⚠️  No photos: "${place.name}"`);
        photosSkipped++;
        continue;
      }

      // Download first photo
      const photoRef = details.photos[0].photo_reference;
      const photoFilename = `${place.slug}.jpg`;
      const photoPath = path.join(OUTPUT_DIR, photoFilename);

      const success = await downloadPhoto(googleApiKey, photoRef, photoPath, tracker);

      if (!success) {
        log(`${prefix} ❌ Download failed: "${place.name}"`);
        errors++;
        continue;
      }

      // Update Convex with local image path
      const imagePath = `/places/${photoFilename}`;
      await client.mutation(api.placesAdmin.updateImages, {
        slug: place.slug,
        images: [imagePath],
      });

      log(`${prefix} ✅ Added photo: "${place.name}"`);
      photosAdded++;

      // Small delay to avoid rate limiting
      await new Promise((r) => setTimeout(r, 200));
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      log(`${prefix} ❌ Error: "${place.name}" - ${errMsg}`);
      errors++;
    }

    // Budget check - stop if approaching $4.40
    const currentCost = calculateCost(tracker);
    if (currentCost.total >= 4.2) {
      log("⚠️  BUDGET WARNING: Approaching $4.40 limit, stopping!");
      break;
    }
  }

  // Final summary
  const finalCost = calculateCost(tracker);

  console.log();
  console.log("╔══════════════════════════════════════════════╗");
  console.log("║  📊 Photo Import Complete!                    ║");
  console.log("╚══════════════════════════════════════════════╝");
  console.log();
  log(`✅ Photos added:  ${photosAdded}`);
  log(`⏭️  Skipped:       ${photosSkipped}`);
  log(`❌ Errors:        ${errors}`);
  console.log();
  console.log("💰 Cost Breakdown:");
  console.log(`   Text Search:   $${finalCost.textSearch.toFixed(3)} (${tracker.textSearchCount} × $${COST_TEXT_SEARCH})`);
  console.log(`   Place Details: $${finalCost.placeDetails.toFixed(3)} (${tracker.placeDetailsCount} × $${COST_PLACE_DETAILS})`);
  console.log(`   Photos:        $${finalCost.photos.toFixed(3)} (${tracker.photoCount} × $${COST_PHOTO})`);
  console.log(`   ────────────────────────`);
  console.log(`   TOTAL:         $${finalCost.total.toFixed(2)}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
