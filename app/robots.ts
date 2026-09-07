import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            // The similarity endpoint is only useful with a query; keep crawlers off it.
            disallow: '/api/',
        },
        sitemap: 'https://evwinners.org/sitemap.xml',
    }
}
