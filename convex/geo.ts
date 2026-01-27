import { query } from "./_generated/server";
import { v } from "convex/values";

// Haversine distance in km
function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Calculate bounding box for a given center + radius (km)
function getBoundingBox(
  lat: number,
  lng: number,
  radiusKm: number
): { minLat: number; maxLat: number; minLng: number; maxLng: number } {
  const latDelta = radiusKm / 111.32;
  const lngDelta = radiusKm / (111.32 * Math.cos((lat * Math.PI) / 180));
  return {
    minLat: lat - latDelta,
    maxLat: lat + latDelta,
    minLng: lng - lngDelta,
    maxLng: lng + lngDelta,
  };
}

export const getNearby = query({
  args: {
    lat: v.number(),
    lng: v.number(),
    radiusKm: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const radius = args.radiusKm ?? 10;
    const limit = args.limit ?? 20;
    const bbox = getBoundingBox(args.lat, args.lng, radius);

    // Get all places and filter by bounding box
    const allPlaces = await ctx.db.query("places").collect();

    const inBounds = allPlaces.filter(
      (p) =>
        p.lat >= bbox.minLat &&
        p.lat <= bbox.maxLat &&
        p.lng >= bbox.minLng &&
        p.lng <= bbox.maxLng
    );

    // Calculate exact distance and sort
    const withDistance = inBounds.map((p) => ({
      ...p,
      distance: haversineDistance(args.lat, args.lng, p.lat, p.lng),
    }));

    withDistance.sort((a, b) => a.distance - b.distance);

    return withDistance.slice(0, limit);
  },
});

export const getInBounds = query({
  args: {
    minLat: v.number(),
    maxLat: v.number(),
    minLng: v.number(),
    maxLng: v.number(),
  },
  handler: async (ctx, args) => {
    const allPlaces = await ctx.db.query("places").collect();

    return allPlaces.filter(
      (p) =>
        p.lat >= args.minLat &&
        p.lat <= args.maxLat &&
        p.lng >= args.minLng &&
        p.lng <= args.maxLng
    );
  },
});
