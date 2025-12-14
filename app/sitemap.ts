import { MetadataRoute } from 'next'
import { neon } from '@neondatabase/serverless'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://sommelier.quest'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/wines`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ]

  // Dynamic wine pages - fetch wine IDs from database
  let winePages: MetadataRoute.Sitemap = []
  try {
    if (process.env.DATABASE_URL) {
      const sql = neon(process.env.DATABASE_URL)
      const wines = await sql`SELECT id FROM wines WHERE is_active = true ORDER BY id`
      winePages = wines.map((wine) => ({
        url: `${baseUrl}/wines/${wine.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }))
    }
  } catch (error) {
    console.error('Error fetching wines for sitemap:', error)
  }

  return [...staticPages, ...winePages]
}
