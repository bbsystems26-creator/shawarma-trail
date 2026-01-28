#!/usr/bin/env npx tsx
/**
 * Google Maps Shawarma Scraper for ShawarmaBis
 *
 * Scrapes shawarma places from Google Maps across Israeli cities
 * and outputs structured JSON matching the Convex places schema.
 *
 * Usage: npx tsx scripts/scrape-google-maps.ts [--city "תל אביב"] [--limit 10] [--headless]
 */

import puppeteer, { type Browser, type Page } from "puppeteer";
import * as fs from "fs";
import * as path from "path";

// ─── Configuration ──────────────────────────────────────────────────────────

const SEARCH_QUERY = "שווארמה";
const OUTPUT_DIR = path.join(__dirname, "output");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "scraped-places.json");

const CITIES = [
  "תל אביב",
  "ירושלים",
  "חיפה",
  "באר שבע",
  "אשדוד",
  "נתניה",
  "פתח תקווה",
  "ראשון לציון",
  "הרצליה",
  "רמת גן",
  "עכו",
  "טבריה",
  "נצרת",
  "אילת",
  "כפר סבא",
  "רעננה",
  "מודיעין",
];

const REGION_MAP: Record<string, "north" | "center" | "south" | "jerusalem" | "shfela"> = {
  חיפה: "north",
  עכו: "north",
  טבריה: "north",
  נצרת: "north",
  "תל אביב": "center",
  "פתח תקווה": "center",
  "ראשון לציון": "center",
  הרצליה: "center",
  "רמת גן": "center",
  נתניה: "center",
  "כפר סבא": "center",
  רעננה: "center",
  "באר שבע": "south",
  אשדוד: "south",
  אילת: "south",
  ירושלים: "jerusalem",
  מודיעין: "jerusalem",
};

// Delay between actions (ms) — respect rate limits
const DELAY_BETWEEN_CITIES = 8000 + Math.random() * 5000;
const DELAY_BETWEEN_PLACES = 3000 + Math.random() * 3000;
const DELAY_AFTER_SCROLL = 2000;
const MAX_PLACES_PER_CITY = 15;
const MAX_RETRIES = 3;

// ─── Hebrew → Latin Transliteration ─────────────────────────────────────────

const HEBREW_TRANSLITERATION: Record<string, string> = {
  א: "",
  ב: "b",
  ג: "g",
  ד: "d",
  ה: "h",
  ו: "v",
  ז: "z",
  ח: "ch",
  ט: "t",
  י: "y",
  כ: "k",
  ך: "k",
  ל: "l",
  מ: "m",
  ם: "m",
  נ: "n",
  ן: "n",
  ס: "s",
  ע: "a",
  פ: "p",
  ף: "f",
  צ: "ts",
  ץ: "ts",
  ק: "k",
  ר: "r",
  ש: "sh",
  ת: "t",
  // Niqqud (vowels) — strip
  "\u05B0": "e",
  "\u05B1": "e",
  "\u05B2": "a",
  "\u05B3": "o",
  "\u05B4": "i",
  "\u05B5": "e",
  "\u05B6": "e",
  "\u05B7": "a",
  "\u05B8": "a",
  "\u05B9": "o",
  "\u05BA": "o",
  "\u05BB": "u",
  "\u05BC": "",
  "\u05BD": "",
  "\u05BE": "-",
  "\u05BF": "",
  "\u05C1": "",
  "\u05C2": "",
};

function transliterate(hebrew: string): string {
  let result = "";
  for (const char of hebrew) {
    if (HEBREW_TRANSLITERATION[char] !== undefined) {
      result += HEBREW_TRANSLITERATION[char];
    } else if (/[a-zA-Z0-9]/.test(char)) {
      result += char.toLowerCase();
    } else if (char === " " || char === "-" || char === "_") {
      result += "-";
    }
    // skip other characters (punctuation, etc.)
  }
  // Clean up slugs
  return result
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function generateSlug(name: string, city: string): string {
  const nameSlug = transliterate(name);
  const citySlug = transliterate(city);
  if (!nameSlug) return `shawarma-${citySlug}-${Date.now()}`;
  if (nameSlug.includes(citySlug)) return nameSlug;
  return `${nameSlug}-${citySlug}`;
}

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
  kashrut: "none";
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
  tags: string[];
  createdAt: number;
}

// ─── Utility Functions ──────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDelay(base: number, jitter: number = 2000): number {
  return base + Math.random() * jitter;
}

function log(msg: string): void {
  const timestamp = new Date().toISOString().slice(11, 19);
  console.log(`[${timestamp}] ${msg}`);
}

function logError(msg: string, err?: unknown): void {
  const timestamp = new Date().toISOString().slice(11, 19);
  console.error(`[${timestamp}] ❌ ${msg}`, err instanceof Error ? err.message : err ?? "");
}

function generateDescription(name: string, city: string, rating: number, reviewCount: number): string {
  const ratingText =
    rating >= 4.5
      ? "מקום מוערך ביותר"
      : rating >= 4.0
        ? "מקום פופולרי ומומלץ"
        : rating >= 3.5
          ? "מקום מוכר"
          : "מקום שווארמה";
  return `${name} - ${ratingText} ב${city} עם ${reviewCount} ביקורות וציון ${rating} מתוך 5.`;
}

function generateTags(name: string, city: string, rating: number): string[] {
  const tags: string[] = ["שווארמה", city];
  if (rating >= 4.5) tags.push("מומלץ", "top-rated");
  if (rating >= 4.0) tags.push("popular");
  if (name.includes("תימני") || name.includes("תימנית")) tags.push("תימני");
  if (name.includes("עיראקי") || name.includes("עיראקית")) tags.push("עיראקי");
  if (name.includes("דרוזי") || name.includes("דרוזית")) tags.push("דרוזי");
  if (name.includes("טורקי") || name.includes("טורקית")) tags.push("טורקי");
  return tags;
}

// ─── Parse CLI Args ─────────────────────────────────────────────────────────

function parseArgs(): { cities: string[]; limit: number; headless: boolean } {
  const args = process.argv.slice(2);
  let cities = CITIES;
  let limit = MAX_PLACES_PER_CITY;
  let headless = true;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--city" && args[i + 1]) {
      cities = [args[i + 1]];
      i++;
    }
    if (args[i] === "--limit" && args[i + 1]) {
      limit = parseInt(args[i + 1], 10);
      i++;
    }
    if (args[i] === "--headless") {
      headless = true;
    }
    if (args[i] === "--no-headless") {
      headless = false;
    }
  }

  return { cities, limit, headless };
}

// ─── Google Maps Scraper ────────────────────────────────────────────────────

async function launchBrowser(headless: boolean): Promise<Browser> {
  log("🚀 Launching browser...");
  return puppeteer.launch({
    headless: headless ? "new" as any : false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--window-size=1920,1080",
      "--lang=he-IL",
    ],
    defaultViewport: { width: 1920, height: 1080 },
  });
}

async function dismissGoogleConsent(page: Page): Promise<void> {
  try {
    // Google consent dialog — click "Accept all" if present
    const consentButton = await page.$(
      'button[aria-label="Accept all"], form[action*="consent"] button, button:has-text("הכל")'
    );
    if (consentButton) {
      await consentButton.click();
      await sleep(2000);
      log("✅ Dismissed consent dialog");
    }
  } catch {
    // Consent dialog not found — that's fine
  }
}

async function searchGoogleMaps(page: Page, query: string): Promise<void> {
  const url = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
  log(`🔍 Navigating to: ${query}`);
  await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
  await sleep(3000);
  await dismissGoogleConsent(page);
  await sleep(2000);
}

async function scrollResultsList(page: Page, maxScrolls: number = 5): Promise<void> {
  log("📜 Scrolling results list...");
  for (let i = 0; i < maxScrolls; i++) {
    try {
      // The results panel is a scrollable div — find and scroll it
      const scrolled = await page.evaluate(() => {
        const feed = document.querySelector('div[role="feed"]');
        if (feed) {
          feed.scrollTop = feed.scrollHeight;
          return true;
        }
        // Fallback: try the results container
        const container = document.querySelector(".m6QErb.DxyBCb.kA9KIf.dS8AEf");
        if (container) {
          container.scrollTop = container.scrollHeight;
          return true;
        }
        return false;
      });

      if (!scrolled) {
        log("  Could not find scrollable container");
        break;
      }

      await sleep(DELAY_AFTER_SCROLL);

      // Check if we've reached the end
      const endReached = await page.evaluate(() => {
        const endMarker = document.querySelector(".m6QErb.DxyBCb.kA9KIf.dS8AEf .HlvSq");
        return !!endMarker;
      });

      if (endReached) {
        log("  Reached end of results");
        break;
      }
    } catch (err) {
      logError("Scroll error", err);
      break;
    }
  }
}

async function getPlaceLinks(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const links: string[] = [];
    const anchors = document.querySelectorAll('a[href*="/maps/place/"]');
    anchors.forEach((a) => {
      const href = (a as HTMLAnchorElement).href;
      if (href && !links.includes(href)) {
        links.push(href);
      }
    });
    return links;
  });
}

async function extractCoordinatesFromUrl(url: string): Promise<{ lat: number; lng: number } | null> {
  // Try to extract from URL patterns like /@32.0853,34.7818,17z or !3d32.0853!4d34.7818
  const atMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (atMatch) {
    return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
  }

  const dMatch = url.match(/!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/);
  if (dMatch) {
    return { lat: parseFloat(dMatch[1]), lng: parseFloat(dMatch[2]) };
  }

  return null;
}

async function extractPlaceData(
  page: Page,
  placeUrl: string,
  city: string
): Promise<Partial<ScrapedPlace> | null> {
  try {
    await page.goto(placeUrl, { waitUntil: "networkidle2", timeout: 30000 });
    await sleep(randomDelay(2000, 2000));

    // Wait for the place panel to load
    await page.waitForSelector('h1, [data-attrid="title"]', { timeout: 10000 }).catch(() => {});

    const data = await page.evaluate(() => {
      const result: Record<string, any> = {};

      // Name
      const nameEl = document.querySelector("h1.DUwDvf, h1.fontHeadlineLarge");
      result.name = nameEl?.textContent?.trim() ?? "";

      // Rating
      const ratingEl = document.querySelector('div.F7nice span[aria-hidden="true"]');
      result.avgRating = ratingEl ? parseFloat(ratingEl.textContent?.trim() ?? "0") : 0;

      // Review count
      const reviewEl = document.querySelector('div.F7nice span[aria-label*="reviews"], div.F7nice span[aria-label*="ביקורות"]');
      if (reviewEl) {
        const reviewText = reviewEl.getAttribute("aria-label") ?? reviewEl.textContent ?? "";
        const match = reviewText.replace(/,/g, "").match(/(\d+)/);
        result.reviewCount = match ? parseInt(match[1], 10) : 0;
      } else {
        // Fallback — look for parenthesized number near rating
        const reviewSpans = document.querySelectorAll("div.F7nice span");
        for (const span of reviewSpans) {
          const text = span.textContent?.trim() ?? "";
          const match = text.replace(/[(),]/g, "").match(/(\d+)/);
          if (match && parseInt(match[1]) > 1) {
            result.reviewCount = parseInt(match[1], 10);
            break;
          }
        }
        result.reviewCount = result.reviewCount ?? 0;
      }

      // Address
      const addressButton = document.querySelector(
        'button[data-item-id="address"], button[aria-label*="כתובת"], button[aria-label*="Address"]'
      );
      result.address = addressButton?.textContent?.trim() ?? "";
      // Clean up address — remove leading icon text
      if (result.address) {
        result.address = result.address.replace(/^[^\u0590-\u05FF\w]+/, "").trim();
      }

      // Phone
      const phoneButton = document.querySelector(
        'button[data-item-id^="phone:"], button[aria-label*="טלפון"], button[aria-label*="Phone"]'
      );
      if (phoneButton) {
        const phoneText = phoneButton.getAttribute("data-item-id") ?? phoneButton.textContent ?? "";
        const phoneMatch = phoneText.match(/([\d\-+().\s]{7,})/);
        result.phone = phoneMatch ? phoneMatch[1].trim() : undefined;
      }

      // Website
      const websiteButton = document.querySelector(
        'a[data-item-id="authority"], a[aria-label*="אתר"], a[aria-label*="Website"]'
      );
      if (websiteButton) {
        result.website = (websiteButton as HTMLAnchorElement).href ?? undefined;
      }

      // Opening hours
      const hoursTable = document.querySelector('table.eK4R0e, div[aria-label*="שעות"], div[aria-label*="hours"]');
      if (hoursTable) {
        const hours: Record<string, string> = {};
        const rows = hoursTable.querySelectorAll("tr");
        rows.forEach((row) => {
          const cells = row.querySelectorAll("td");
          if (cells.length >= 2) {
            const day = cells[0].textContent?.trim() ?? "";
            const time = cells[1].textContent?.trim() ?? "";
            if (day && time) hours[day] = time;
          }
        });
        if (Object.keys(hours).length > 0) {
          result.openingHours = hours;
        }
      }

      // Images
      const images: string[] = [];
      const imageEls = document.querySelectorAll(
        'button[jsaction*="photo"] img, div.RZ66Rb img, img.p0Hhde, img[decoding="async"]'
      );
      imageEls.forEach((img) => {
        const src = (img as HTMLImageElement).src;
        if (src && src.startsWith("http") && !src.includes("google.com/maps/vt") && !src.includes("gstatic.com/mapfiles")) {
          images.push(src);
        }
      });
      result.images = images.slice(0, 5); // Limit to 5 images

      // Price level ($ signs)
      const priceEl = document.querySelector('span[aria-label*="Price"], span[aria-label*="מחיר"]');
      if (priceEl) {
        const priceText = priceEl.textContent?.trim() ?? "";
        const dollarCount = (priceText.match(/[₪$·]/g) || []).length;
        result.priceRange = Math.min(Math.max(dollarCount, 1), 3);
      }

      return result;
    });

    if (!data.name) {
      log("  ⚠️ No name found, skipping place");
      return null;
    }

    // Extract coordinates from URL
    const currentUrl = page.url();
    const coords = await extractCoordinatesFromUrl(currentUrl);

    return {
      name: data.name,
      address: data.address || `${city}`,
      city,
      avgRating: data.avgRating || 0,
      reviewCount: data.reviewCount || 0,
      phone: data.phone,
      website: data.website,
      openingHours: data.openingHours,
      images: data.images || [],
      priceRange: (data.priceRange || 2) as 1 | 2 | 3,
      lat: coords?.lat ?? 0,
      lng: coords?.lng ?? 0,
    };
  } catch (err) {
    logError(`Failed to extract place data from ${placeUrl}`, err);
    return null;
  }
}

async function scrapeCity(
  browser: Browser,
  city: string,
  limit: number
): Promise<ScrapedPlace[]> {
  const page = await browser.newPage();
  const places: ScrapedPlace[] = [];

  try {
    // Set Hebrew locale
    await page.setExtraHTTPHeaders({ "Accept-Language": "he-IL,he;q=0.9" });

    const query = `${SEARCH_QUERY} ${city}`;
    await searchGoogleMaps(page, query);

    // Scroll to load more results
    await scrollResultsList(page, 4);

    // Get all place links
    const placeLinks = await getPlaceLinks(page);
    log(`📍 Found ${placeLinks.length} places in ${city}`);

    const linksToProcess = placeLinks.slice(0, limit);

    for (let i = 0; i < linksToProcess.length; i++) {
      const link = linksToProcess[i];
      log(`  [${i + 1}/${linksToProcess.length}] Scraping place...`);

      let placeData: Partial<ScrapedPlace> | null = null;
      let retries = 0;

      while (retries < MAX_RETRIES && !placeData) {
        try {
          placeData = await extractPlaceData(page, link, city);
        } catch (err) {
          retries++;
          logError(`  Retry ${retries}/${MAX_RETRIES} for place`, err);
          await sleep(randomDelay(3000, 3000));
        }
      }

      if (placeData && placeData.name) {
        const region = REGION_MAP[city] || "center";
        const slug = generateSlug(placeData.name, city);

        const fullPlace: ScrapedPlace = {
          name: placeData.name,
          slug,
          description: generateDescription(
            placeData.name,
            city,
            placeData.avgRating ?? 0,
            placeData.reviewCount ?? 0
          ),
          address: placeData.address ?? city,
          city,
          region,
          lat: placeData.lat ?? 0,
          lng: placeData.lng ?? 0,
          phone: placeData.phone,
          website: placeData.website,
          kashrut: "none",
          meatTypes: ["mixed"],
          style: ["laffa", "pita"],
          priceRange: placeData.priceRange ?? 2,
          hasDelivery: false,
          hasSeating: true,
          openingHours: placeData.openingHours,
          images: placeData.images ?? [],
          avgRating: placeData.avgRating ?? 0,
          reviewCount: placeData.reviewCount ?? 0,
          isFeatured: false,
          isVerified: false,
          tags: generateTags(placeData.name, city, placeData.avgRating ?? 0),
          createdAt: Date.now(),
        };

        places.push(fullPlace);
        log(`  ✅ ${fullPlace.name} (${fullPlace.avgRating}⭐, ${fullPlace.reviewCount} reviews)`);
      }

      // Rate limiting delay
      await sleep(randomDelay(DELAY_BETWEEN_PLACES, 2000));
    }
  } catch (err) {
    logError(`Failed scraping city: ${city}`, err);
  } finally {
    await page.close();
  }

  return places;
}

// ─── Deduplication ──────────────────────────────────────────────────────────

function deduplicatePlaces(places: ScrapedPlace[]): ScrapedPlace[] {
  const seen = new Map<string, ScrapedPlace>();

  for (const place of places) {
    const existing = seen.get(place.slug);
    if (!existing) {
      seen.set(place.slug, place);
    } else {
      // Keep the one with more reviews (likely more accurate)
      if (place.reviewCount > existing.reviewCount) {
        seen.set(place.slug, place);
      }
    }
  }

  return Array.from(seen.values());
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const { cities, limit, headless } = parseArgs();

  console.log("╔══════════════════════════════════════════╗");
  console.log("║  🥙 ShawarmaBis - Google Maps Scraper    ║");
  console.log("╚══════════════════════════════════════════╝");
  console.log();
  log(`Cities: ${cities.length}`);
  log(`Max places per city: ${limit}`);
  log(`Headless: ${headless}`);
  console.log();

  // Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Load existing results if any (for incremental scraping)
  let allPlaces: ScrapedPlace[] = [];
  if (fs.existsSync(OUTPUT_FILE)) {
    try {
      const existing = JSON.parse(fs.readFileSync(OUTPUT_FILE, "utf-8"));
      allPlaces = Array.isArray(existing) ? existing : [];
      log(`📂 Loaded ${allPlaces.length} existing places from previous run`);
    } catch {
      log("⚠️ Could not load existing results, starting fresh");
    }
  }

  let browser: Browser | null = null;

  try {
    browser = await launchBrowser(headless);

    for (let i = 0; i < cities.length; i++) {
      const city = cities[i];
      console.log();
      log(`════════════════════════════════════════════`);
      log(`🏙️  City ${i + 1}/${cities.length}: ${city}`);
      log(`════════════════════════════════════════════`);

      const cityPlaces = await scrapeCity(browser, city, limit);
      allPlaces.push(...cityPlaces);

      log(`✅ Scraped ${cityPlaces.length} places from ${city}`);

      // Save intermediate results after each city
      const deduped = deduplicatePlaces(allPlaces);
      fs.writeFileSync(OUTPUT_FILE, JSON.stringify(deduped, null, 2), "utf-8");
      log(`💾 Saved ${deduped.length} total places (intermediate)`);

      // Delay between cities
      if (i < cities.length - 1) {
        const delay = randomDelay(DELAY_BETWEEN_CITIES, 5000);
        log(`⏳ Waiting ${Math.round(delay / 1000)}s before next city...`);
        await sleep(delay);
      }
    }
  } catch (err) {
    logError("Fatal error", err);
  } finally {
    if (browser) {
      await browser.close();
      log("🔒 Browser closed");
    }
  }

  // Final dedup and save
  const finalPlaces = deduplicatePlaces(allPlaces);
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalPlaces, null, 2), "utf-8");

  console.log();
  console.log("╔══════════════════════════════════════════╗");
  console.log("║  📊 Scraping Complete!                    ║");
  console.log("╚══════════════════════════════════════════╝");
  console.log();
  log(`Total places scraped: ${finalPlaces.length}`);
  log(`Output saved to: ${OUTPUT_FILE}`);

  // Print summary by city
  const byCityCount = new Map<string, number>();
  for (const place of finalPlaces) {
    byCityCount.set(place.city, (byCityCount.get(place.city) ?? 0) + 1);
  }
  console.log();
  log("📊 Places by city:");
  for (const [city, count] of byCityCount) {
    log(`   ${city}: ${count}`);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
