import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://aionysus.wine'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/handler/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
