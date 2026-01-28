import type { MetadataRoute } from 'next'
import { fetchQuery } from 'convex/nextjs'
import { api } from '../../convex/_generated/api'

const BASE_URL = 'https://shawarmabis.co.il'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/explore`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/map`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog/guide`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Dynamic place pages from Convex
  try {
    const places = await fetchQuery(api.places.listAll, { limit: 500 })
    const placePages: MetadataRoute.Sitemap = places.map(
      (place: { slug: string }) => ({
        url: `${BASE_URL}/place/${place.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })
    )
    return [...staticPages, ...placePages]
  } catch (error) {
    // If Convex fetch fails at build time, return static pages only
    // Dynamic place routes will be added when Convex is accessible
    console.warn('Sitemap: Could not fetch places from Convex:', error)
    return staticPages
  }
}
