#!/usr/bin/env npx tsx
/**
 * Import Scraped Places to Convex — ShawarmaBis
 *
 * Reads scraped-places.json and upserts places into Convex by slug.
 * Uses the Convex HTTP client to call mutations directly.
 *
 * Usage:
 *   npx tsx scripts/import-to-convex.ts [--dry-run] [--file path/to/file.json]
 *
 * Environment:
 *   CONVEX_URL — your Convex deployment URL (or reads from .env.local)
 */

import * as fs from "fs";
import * as path from "path";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
// NOTE: After adding convex/placesAdmin.ts, run `npx convex dev` or `npx convex push`
// to regenerate the API types before running this script.

// ─── Configuration ──────────────────────────────────────────────────────────

const DEFAULT_INPUT_FILE = path.join(__dirname, "output", "scraped-places.json");

// ─── Types ──────────────────────────────────────────────────────────────────

interface ScrapedPlace {
  name: string;
  slug: string;
  description: string;
  address: string;
  city: string;
  region: "north" | "center" | "south" | "jerusalem" | "shfela";
  lat: number;
  lng: number;
  phone?: string;
  website?: string;
  kashrut: "none" | "regular" | "mehadrin" | "badatz";
  meatTypes: string[];
  style: string[];
  priceRange: 1 | 2 | 3;
  hasDelivery: boolean;
  hasSeating: boolean;
  openingHours?: Record<string, string>;
  images: string[];
  avgRating: number;
  reviewCount: number;
  isFeatured: boolean;
  isVerified: boolean;
  tags?: string[];
  createdAt?: number;
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
        // Strip quotes
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        env[key] = value;
      }
      return env;
    }
  }

  return {};
}

function getConvexUrl(): string {
  // Check env var first
  if (process.env.CONVEX_URL) return process.env.CONVEX_URL;

  // Check NEXT_PUBLIC_CONVEX_URL
  if (process.env.NEXT_PUBLIC_CONVEX_URL) return process.env.NEXT_PUBLIC_CONVEX_URL;

  // Try to load from .env.local
  const env = loadEnvFile();
  if (env.CONVEX_URL) return env.CONVEX_URL;
  if (env.NEXT_PUBLIC_CONVEX_URL) return env.NEXT_PUBLIC_CONVEX_URL;

  throw new Error(
    "CONVEX_URL not found. Set CONVEX_URL env var or ensure .env.local has NEXT_PUBLIC_CONVEX_URL."
  );
}

// ─── Parse Args ─────────────────────────────────────────────────────────────

function parseArgs(): { inputFile: string; dryRun: boolean } {
  const args = process.argv.slice(2);
  let inputFile = DEFAULT_INPUT_FILE;
  let dryRun = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--file" && args[i + 1]) {
      inputFile = args[i + 1];
      i++;
    }
    if (args[i] === "--dry-run") {
      dryRun = true;
    }
  }

  return { inputFile, dryRun };
}

// ─── Validate Place Data ────────────────────────────────────────────────────

function validatePlace(place: ScrapedPlace): string[] {
  const errors: string[] = [];

  if (!place.name) errors.push("Missing name");
  if (!place.slug) errors.push("Missing slug");
  if (!place.address) errors.push("Missing address");
  if (!place.city) errors.push("Missing city");
  if (!place.region) errors.push("Missing region");
  if (!["north", "center", "south", "jerusalem", "shfela"].includes(place.region)) {
    errors.push(`Invalid region: ${place.region}`);
  }
  if (place.lat === 0 && place.lng === 0) {
    errors.push("Missing coordinates (lat=0, lng=0)");
  }
  if (place.avgRating < 0 || place.avgRating > 5) {
    errors.push(`Invalid rating: ${place.avgRating}`);
  }
  if (![1, 2, 3].includes(place.priceRange)) {
    errors.push(`Invalid priceRange: ${place.priceRange}`);
  }

  return errors;
}

// ─── Import Logic ───────────────────────────────────────────────────────────

async function importPlaces(
  client: ConvexHttpClient,
  places: ScrapedPlace[],
  dryRun: boolean
): Promise<{ imported: number; skipped: number; errors: number }> {
  let imported = 0;
  let skipped = 0;
  let errors = 0;

  for (let i = 0; i < places.length; i++) {
    const place = places[i];
    const prefix = `[${i + 1}/${places.length}]`;

    // Validate
    const validationErrors = validatePlace(place);
    if (validationErrors.length > 0) {
      log(`${prefix} ⚠️  Skipping "${place.name}": ${validationErrors.join(", ")}`);
      skipped++;
      continue;
    }

    try {
      // Check if place already exists by slug
      const existing = await client.query(api.places.getBySlug, { slug: place.slug });

      if (dryRun) {
        if (existing) {
          log(`${prefix} 🔄 Would UPDATE: "${place.name}" (slug: ${place.slug})`);
        } else {
          log(`${prefix} ➕ Would CREATE: "${place.name}" (slug: ${place.slug})`);
        }
        imported++;
        continue;
      }

      // Build the place document for Convex
      const placeDoc = {
        name: place.name,
        slug: place.slug,
        description: place.description || undefined,
        address: place.address,
        city: place.city,
        region: place.region,
        lat: place.lat,
        lng: place.lng,
        phone: place.phone || undefined,
        website: place.website || undefined,
        kashrut: place.kashrut as "none" | "regular" | "mehadrin" | "badatz",
        meatTypes: place.meatTypes,
        style: place.style,
        priceRange: place.priceRange as 1 | 2 | 3,
        hasDelivery: place.hasDelivery,
        hasSeating: place.hasSeating,
        openingHours: place.openingHours || undefined,
        images: place.images,
        avgRating: place.avgRating,
        reviewCount: place.reviewCount,
        isFeatured: place.isFeatured,
        isVerified: place.isVerified,
        tags: place.tags,
        createdAt: place.createdAt ?? Date.now(),
      };

      // Use the upsertPlace mutation if it exists, otherwise we'll need to create one
      // For now, we'll use a direct approach: check existence, then insert or patch
      // Upsert via the placesAdmin mutation
      const result = await client.mutation(api.placesAdmin.upsertPlace, {
        slug: place.slug,
        data: placeDoc,
      });

      if (result.action === "updated") {
        log(`${prefix} 🔄 Updated: "${place.name}"`);
      } else {
        log(`${prefix} ➕ Created: "${place.name}"`);
      }

      imported++;
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      log(`${prefix} ❌ Error importing "${place.name}": ${errMsg}`);
      errors++;
    }

    // Small delay to avoid overwhelming Convex
    await new Promise((r) => setTimeout(r, 100));
  }

  return { imported, skipped, errors };
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const { inputFile, dryRun } = parseArgs();

  console.log("╔══════════════════════════════════════════════╗");
  console.log("║  🥙 ShawarmaBis - Convex Importer             ║");
  console.log("╚══════════════════════════════════════════════╝");
  console.log();

  if (dryRun) {
    log("🏷️  DRY RUN MODE — no changes will be made");
  }

  // Load scraped data
  if (!fs.existsSync(inputFile)) {
    console.error(`❌ Input file not found: ${inputFile}`);
    console.error('Run the scraper first: npx tsx scripts/scrape-google-maps.ts');
    process.exit(1);
  }

  const rawData = fs.readFileSync(inputFile, "utf-8");
  let places: ScrapedPlace[];
  try {
    places = JSON.parse(rawData);
  } catch {
    console.error(`❌ Failed to parse JSON from: ${inputFile}`);
    process.exit(1);
  }

  if (!Array.isArray(places) || places.length === 0) {
    console.error("❌ No places found in input file");
    process.exit(1);
  }

  log(`📂 Loaded ${places.length} places from ${inputFile}`);
  console.log();

  // Connect to Convex
  const convexUrl = getConvexUrl();
  log(`🔗 Connecting to Convex: ${convexUrl}`);
  const client = new ConvexHttpClient(convexUrl);

  // Import
  const result = await importPlaces(client, places, dryRun);

  console.log();
  console.log("╔══════════════════════════════════════════════╗");
  console.log("║  📊 Import Complete!                          ║");
  console.log("╚══════════════════════════════════════════════╝");
  console.log();
  log(`✅ Imported: ${result.imported}`);
  log(`⏭️  Skipped:  ${result.skipped}`);
  log(`❌ Errors:   ${result.errors}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
