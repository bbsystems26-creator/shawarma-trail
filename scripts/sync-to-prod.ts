import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const DEV_URL = "https://gallant-raven-961.convex.cloud";
const PROD_URL = "https://cool-rook-283.convex.cloud";

const devClient = new ConvexHttpClient(DEV_URL);
const prodClient = new ConvexHttpClient(PROD_URL);

async function main() {
  console.log("Fetching places from DEV...");
  const devPlaces = await devClient.query(api.places.filter, {});
  console.log(`Found ${devPlaces.length} places in DEV`);
  
  console.log("Fetching places from PROD...");
  const prodPlaces = await prodClient.query(api.places.filter, {});
  console.log(`Found ${prodPlaces.length} places in PROD`);
  
  // Find places in dev that don't exist in prod (by slug)
  const prodSlugs = new Set(prodPlaces.map(p => p.slug));
  const newPlaces = devPlaces.filter(p => !prodSlugs.has(p.slug));
  
  console.log(`\n${newPlaces.length} new places to sync to PROD`);
  
  // Sync new places using upsertPlace
  let synced = 0;
  for (const place of newPlaces) {
    try {
      const { _id, _creationTime, claimedBy, ownerStory, socialLinks, menuItems, tips, ...placeData } = place as any;
      
      await prodClient.mutation(api.placesAdmin.upsertPlace, {
        slug: place.slug,
        data: {
          ...placeData,
          // Ensure required fields
          images: placeData.images || [],
          meatTypes: placeData.meatTypes || [],
          style: placeData.style || [],
        }
      });
      synced++;
      if (synced % 50 === 0) {
        console.log(`Synced ${synced}/${newPlaces.length}`);
      }
    } catch (err: any) {
      console.error(`Error syncing ${place.name}:`, err.message?.slice(0, 100));
    }
  }
  
  console.log(`\n✅ Synced ${synced} new places to PROD`);
  
  // Also update images for existing places that have images in dev but not in prod
  console.log("\nUpdating images for existing places...");
  let imagesUpdated = 0;
  for (const devPlace of devPlaces) {
    if (devPlace.images && devPlace.images.length > 0) {
      const prodPlace = prodPlaces.find(p => p.slug === devPlace.slug);
      if (prodPlace && (!prodPlace.images || prodPlace.images.length === 0)) {
        try {
          await prodClient.mutation(api.placesAdmin.updateImages, {
            slug: devPlace.slug,
            images: devPlace.images
          });
          imagesUpdated++;
        } catch (err: any) {
          // Ignore errors
        }
      }
    }
  }
  console.log(`✅ Updated images for ${imagesUpdated} existing places`);
  
  // Final count
  const finalProd = await prodClient.query(api.places.filter, {});
  console.log(`\n📊 Final PROD count: ${finalProd.length} places`);
}

main().catch(console.error);
