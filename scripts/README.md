# 🥙 ShawarmaBis Scripts

Scripts for scraping and importing shawarma place data.

## Prerequisites

```bash
# Install puppeteer (for scraping)
npm install puppeteer

# Install tsx (for running TypeScript)
npm install -D tsx

# Make sure Convex is set up
npx convex dev   # regenerates API types after adding placesAdmin.ts
```

## Scripts

### 1. `scrape-google-maps.ts` — Google Maps Scraper

Scrapes shawarma places from Google Maps across 17 Israeli cities.

```bash
# Scrape all cities (default)
npx tsx scripts/scrape-google-maps.ts

# Scrape a single city
npx tsx scripts/scrape-google-maps.ts --city "תל אביב"

# Limit places per city
npx tsx scripts/scrape-google-maps.ts --limit 5

# Show browser window (useful for debugging)
npx tsx scripts/scrape-google-maps.ts --no-headless

# Combine options
npx tsx scripts/scrape-google-maps.ts --city "ירושלים" --limit 10 --no-headless
```

**Output:** `scripts/output/scraped-places.json`

**Features:**
- Searches "שווארמה" + city name on Google Maps
- Extracts: name, address, lat/lng, rating, review count, phone, website, hours, photos
- Hebrew → Latin transliteration for slug generation
- Automatic region classification (north/center/south/jerusalem/shfela)
- Rate limiting with random delays between requests
- Retry logic (3 attempts per place)
- Incremental scraping — appends to existing results
- Deduplication by slug
- Intermediate saves after each city

**Cities covered:**
| Region | Cities |
|--------|--------|
| North | חיפה, עכו, טבריה, נצרת |
| Center | תל אביב, פתח תקווה, ראשון לציון, הרצליה, רמת גן, נתניה, כפר סבא, רעננה |
| South | באר שבע, אשדוד, אילת |
| Jerusalem | ירושלים, מודיעין |

### 2. `import-to-convex.ts` — Convex Importer

Reads scraped JSON and upserts places into Convex.

```bash
# Dry run (preview what would happen)
npx tsx scripts/import-to-convex.ts --dry-run

# Import for real
npx tsx scripts/import-to-convex.ts

# Import from a custom file
npx tsx scripts/import-to-convex.ts --file path/to/places.json
```

**Requirements:**
- `CONVEX_URL` or `NEXT_PUBLIC_CONVEX_URL` must be set (in env or `.env.local`)
- The `convex/placesAdmin.ts` mutation must be deployed (`npx convex push`)

**Behavior:**
- Validates each place before import
- Upserts by slug (creates if new, updates if exists)
- Preserves manually-set fields (isFeatured, isVerified, claimedBy, etc.)
- Logs every action with progress

## Architecture

```
scripts/
├── README.md                          # This file
├── scrape-google-maps.ts              # Google Maps scraper
├── import-to-convex.ts                # Convex importer
└── output/
    └── scraped-places.json            # Scraped data (gitignored)

convex/
└── placesAdmin.ts                     # Upsert mutation for import
```

## Data Flow

```
Google Maps  →  scrape-google-maps.ts  →  scraped-places.json  →  import-to-convex.ts  →  Convex DB
```

## Notes

- **Rate limiting:** The scraper adds random delays (3-8s between places, 8-13s between cities) to avoid being blocked by Google.
- **Google might block:** If you run too aggressively, Google may show CAPTCHAs. Use `--no-headless` to solve them manually, or reduce `--limit`.
- **Coordinates:** Extracted from the Google Maps URL. Some places may have `lat=0, lng=0` if the URL format changes.
- **Kashrut:** Always defaults to `"none"` — Google Maps doesn't have kashrut data. Update manually or from another source.
- **Incremental:** Re-running the scraper appends to existing results and deduplicates. Safe to run multiple times.
- **Hebrew slugs:** Names are transliterated character-by-character. Results are reasonable but not perfect — review the output.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `Cannot find module 'puppeteer'` | `npm install puppeteer` |
| `CONVEX_URL not found` | Set in `.env.local` or as env var |
| `api.placesAdmin is undefined` | Run `npx convex dev` to regenerate types |
| Google showing CAPTCHAs | Use `--no-headless`, solve CAPTCHA, then it continues |
| No places found in a city | Google might have changed their DOM. Check selectors in the script |
| `lat=0, lng=0` for some places | URL pattern changed. Check `extractCoordinatesFromUrl()` |
