const BASE_URL = 'https://shawarmabis.co.il'

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'שווארמה ביס',
    alternateName: 'ShawarmaBis',
    url: BASE_URL,
    description:
      'מפה אינטראקטיבית של מקומות השווארמה הטובים בישראל — דירוגים, ביקורות, ופילטרים חכמים',
    inLanguage: 'he',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/explore?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

interface Place {
  name: string
  slug: string
  description?: string
  address: string
  city: string
  lat: number
  lng: number
  phone?: string
  website?: string
  priceRange: 1 | 2 | 3
  avgRating: number
  reviewCount: number
}

export function generateRestaurantSchema(place: Place) {
  const priceRangeMap: Record<number, string> = {
    1: '₪',
    2: '₪₪',
    3: '₪₪₪',
  }

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: place.name,
    description:
      place.description || `${place.name} — שווארמה ב${place.city}`,
    url: `${BASE_URL}/place/${place.slug}`,
    servesCuisine: ['שווארמה', 'Israeli'],
    priceRange: priceRangeMap[place.priceRange] ?? '₪₪',
    address: {
      '@type': 'PostalAddress',
      streetAddress: place.address,
      addressLocality: place.city,
      addressCountry: 'IL',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: place.lat,
      longitude: place.lng,
    },
  }

  if (place.reviewCount > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: place.avgRating,
      bestRating: 5,
      worstRating: 1,
      reviewCount: place.reviewCount,
    }
  }

  if (place.phone) {
    schema.telephone = place.phone
  }

  if (place.website) {
    schema.sameAs = place.website
  }

  return schema
}

export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
