import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://sommelier.quest'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/handler/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
