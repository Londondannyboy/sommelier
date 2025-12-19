import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { neon } from '@neondatabase/serverless'
import WineDetailClient from './WineDetailClient'

const sql = neon(process.env.DATABASE_URL!)

interface Wine {
  id: number
  name: string
  slug: string
  winery: string
  region: string
  country: string
  grape_variety: string
  vintage: number | null
  wine_type: string
  style: string
  color: string | null
  price_retail: number | null
  tasting_notes: string
  food_pairings: string
  alcohol_percentage: number | null
  image_url: string
}

async function getWine(idOrSlug: string): Promise<Wine | null> {
  const isNumericId = /^\d+$/.test(idOrSlug)

  let results
  if (isNumericId) {
    results = await sql`
      SELECT id, name, slug, winery, region, country, grape_variety,
             vintage, wine_type, style, color, price_retail,
             tasting_notes, food_pairings, alcohol_percentage, image_url
      FROM wines
      WHERE id = ${idOrSlug} AND is_active = true
      LIMIT 1
    `
  } else {
    results = await sql`
      SELECT id, name, slug, winery, region, country, grape_variety,
             vintage, wine_type, style, color, price_retail,
             tasting_notes, food_pairings, alcohol_percentage, image_url
      FROM wines
      WHERE slug = ${idOrSlug} AND is_active = true
      LIMIT 1
    `
  }

  return results[0] as Wine | null
}

// Generate SEO-optimized metadata
export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const wine = await getWine(id)

  if (!wine) {
    return {
      title: 'Wine Not Found | Aionysus',
      description: 'The requested wine could not be found in our collection.'
    }
  }

  // Build keyword-rich title (30-60 characters optimal)
  const vintage = wine.vintage ? `${wine.vintage} ` : ''
  const title = `${vintage}${wine.name} | Buy Fine Wine | Aionysus`

  // Build comprehensive meta description (150-160 characters)
  const priceText = wine.price_retail
    ? `£${wine.price_retail.toLocaleString('en-GB')}`
    : 'Price on request'
  const description = `Buy ${vintage}${wine.name} from ${wine.region}, ${wine.country}. ${wine.wine_type.charAt(0).toUpperCase() + wine.wine_type.slice(1)} wine by ${wine.winery}. ${priceText}. Expert wine recommendations from Aionysus.`

  // Canonical URL using slug
  const canonicalSlug = wine.slug || wine.id.toString()

  return {
    title,
    description,
    keywords: [
      wine.name,
      wine.winery,
      wine.region,
      wine.country,
      wine.wine_type,
      wine.grape_variety,
      vintage ? `${wine.vintage} wine` : 'fine wine',
      'buy wine online',
      'fine wine',
      'investment wine'
    ].filter(Boolean).join(', '),
    openGraph: {
      title: `${vintage}${wine.name} - Fine Wine from ${wine.region}`,
      description,
      type: 'website',
      url: `https://aionysus.wine/wines/${canonicalSlug}`,
      images: wine.image_url ? [
        {
          url: wine.image_url,
          width: 400,
          height: 600,
          alt: `${vintage}${wine.name} - ${wine.wine_type} wine from ${wine.region}, ${wine.country}`
        }
      ] : undefined,
      siteName: 'Aionysus - AI Wine Sommelier'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${vintage}${wine.name}`,
      description,
      images: wine.image_url ? [wine.image_url] : undefined
    },
    alternates: {
      canonical: `https://aionysus.wine/wines/${canonicalSlug}`
    },
    robots: {
      index: true,
      follow: true
    }
  }
}

// Generate static params for common wines (optional - improves build performance)
export async function generateStaticParams() {
  // Return empty array for now - all pages will be dynamically generated
  return []
}

export default async function WineDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const wine = await getWine(id)

  if (!wine) {
    notFound()
  }

  // Parse food pairings if it's a string
  const foodPairings = wine.food_pairings
    ? (typeof wine.food_pairings === 'string'
        ? wine.food_pairings.split(',').map(p => p.trim()).filter(Boolean)
        : wine.food_pairings)
    : []

  // Build structured data for SEO (JSON-LD)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${wine.vintage ? `${wine.vintage} ` : ''}${wine.name}`,
    description: wine.tasting_notes || `Fine ${wine.wine_type} wine from ${wine.region}, ${wine.country}`,
    image: wine.image_url,
    brand: {
      '@type': 'Brand',
      name: wine.winery
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'GBP',
      price: wine.price_retail || 0,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Aionysus'
      }
    },
    category: `${wine.wine_type} Wine`,
    countryOfOrigin: {
      '@type': 'Country',
      name: wine.country
    }
  }

  const vintage = wine.vintage ? `${wine.vintage} ` : ''

  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <WineDetailClient
        wine={{
          ...wine,
          food_pairings: foodPairings
        }}
        vintage={vintage}
      />
    </>
  )
}
