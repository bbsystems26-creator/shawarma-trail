#!/usr/bin/env npx tsx
/**
 * Remove non-shawarma places from Convex
 */

import { ConvexHttpClient } from "convex/browser";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!CONVEX_URL) {
  console.error("❌ Missing NEXT_PUBLIC_CONVEX_URL");
  process.exit(1);
}

const convex = new ConvexHttpClient(CONVEX_URL);

// Slugs of places that are NOT shawarma (pure falafel/hummus/burger/schnitzel places)
const NON_SHAWARMA_SLUGS = [
  "falafel-nuna-rannh",
  "tanaami-falafel-rannh", 
  "plpl-chtvkh-rannh",
  "hummus-tanami-rannh",
  "burger-station-raanana-rannh",
  "mpgsh-hplpl-htymny-gbatyym",
  "myykbvrgr-lvd",
  "myykbvrgr-rmlh",
  "plplbrybvaybnh-ybnh",
  "mlkhplpl-nhryh",
  "chvmvsmklyhmlkymkrmyl-krmyl",
  "shnytslyyk-shklvn",
  "shnytslbvrvn-shklvn",
  "hpszmsadthmbvrgr-shdrvt",
  "drshnytslgryl-shdrvt",
  "hplplshlytn-vpkym",
  "plpldhmry-vpkym",
  "hshnytslyh-ryl",
  "plplbtchnh-malhdvmym",
  "burgersbarbvrgrsbrhmbvrgrkshrmalhdvmym-malhdvmym",
  "plplbdr-bytraylyt",
];

// Places with both "שווארמה" and "פלאפל" in name - keep these
// "shvvrmhplpllyhv-kryytt" - שווארמה פלאפל אליהו - KEEP
// "shvvrmhvplplbrkh-tspt" - שווארמה ופלאפל בארכה - KEEP
// "hplplshlllvlalosfalafel-tspt" - הפלאפל של לאלו - DELETE
// "plplytschk-tspt" - פלאפל יצחק - DELETE
// "bythpvlvhshvvrmh..." - בית הפול והשווארמה - KEEP (has שווארמה)
// "mpgshhshvvrmhvhplpl-bytraylyt" - מפגש השווארמה והפלאפל - KEEP

async function main() {
  console.log("╔══════════════════════════════════════════╗");
  console.log("║  🧹 Cleanup Non-Shawarma Places          ║");
  console.log("╚══════════════════════════════════════════╝\n");

  let deleted = 0;
  let notFound = 0;
  let errors = 0;

  for (const slug of NON_SHAWARMA_SLUGS) {
    try {
      // First get the place to confirm it exists
      const place = await convex.query("places:getBySlug" as any, { slug });
      
      if (!place) {
        console.log(`⏭️  ${slug} — not found`);
        notFound++;
        continue;
      }

      // For now, just list what we would delete
      console.log(`🗑️  Would delete: ${place.name} (${slug})`);
      deleted++;
      
    } catch (err: any) {
      console.log(`❌ Error with ${slug}: ${err.message}`);
      errors++;
    }
  }

  console.log("\n📊 Summary:");
  console.log(`   Would delete: ${deleted}`);
  console.log(`   Not found: ${notFound}`);
  console.log(`   Errors: ${errors}`);
  
  console.log("\n⚠️  This is a DRY RUN. Actual deletion requires deleteBySlug mutation.");
}

main().catch(console.error);
