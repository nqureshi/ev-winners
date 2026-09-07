import type { MetadataRoute } from 'next'
import { loadWinners } from './lib/winners'

/** The site is a single page; report it as updated whenever a cohort was last added. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const winners = await loadWinners()
    const latest = winners.reduce((a, b) => (a.date_announced > b.date_announced ? a : b))
    return [
        {
            url: 'https://evwinners.org',
            lastModified: new Date(latest.date_announced + 'T00:00:00Z'),
            changeFrequency: 'weekly',
            priority: 1,
        },
    ]
}
