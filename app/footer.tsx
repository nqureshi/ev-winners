import type { Stats } from "./container"
import { formatLongDate } from "./types"

const A = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a className="link-underline text-ink" href={href} target="_blank" rel="noopener noreferrer">
        {children}
    </a>
)

export default function Footer({ stats }: { stats: Stats }) {
    const updated = formatLongDate(stats.latestDate)

    return (
        <footer id="about" className="scroll-mt-14 border-t border-paper-line bg-paper-soft/70">
            <div className="mx-auto grid max-w-5xl gap-10 px-5 py-14 sm:px-8 sm:py-16 md:grid-cols-[1.35fr_1fr] md:gap-16">
                <div>
                    <h2 className="font-serif text-3xl text-ink">About this site</h2>
                    <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-ink-soft">
                        <p>
                            <A href="https://www.mercatus.org/emergent-ventures">Emergent Ventures</A> lives at the Mercatus Center at George Mason University
                            and was founded by <A href="https://en.wikipedia.org/wiki/Tyler_Cowen">Tyler Cowen</A>, economist and author of{' '}
                            <A href="https://marginalrevolution.com">Marginal Revolution</A>. This is an independent project, not an official website.
                        </p>
                        <p>
                            Winners are collected from the announcement posts on Marginal Revolution, starting from{' '}
                            <A href="https://newscience.org/emergent-ventures-winners/">Alexey Guzey&rsquo;s base</A>. Spotted a gap?
                            Submit a data update to the <A href="https://github.com/nqureshi/ev-search-python/tree/main/data">GitHub repo</A>.
                        </p>
                        <p>
                            Project by <A href="https://nabeelqu.co">Nabeel S. Qureshi</A>. Design originally inspired by{' '}
                            <A href="https://thesephist.com">Linus Lee</A>&rsquo;s <A href="https://ycvibecheck.com/">YC Vibe Check</A>.
                        </p>
                    </div>
                </div>

                <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 self-start text-sm sm:text-[15px]">
                    <dt className="text-ink-muted">Last update</dt>
                    <dd className="text-ink-soft">
                        {stats.latestLink ? <A href={stats.latestLink}>Cohort {stats.cohorts}</A> : `Cohort ${stats.cohorts}`}
                        <span className="text-ink-muted"> · {updated}</span>
                    </dd>
                    <dt className="text-ink-muted">Winners</dt>
                    <dd className="tabular-nums text-ink-soft">{stats.winners.toLocaleString('en-US')}</dd>
                    <dt className="text-ink-muted">Data</dt>
                    <dd className="text-ink-soft">
                        <A href="https://github.com/nqureshi/ev-search-python/blob/main/data/ev-winners.csv">CSV on GitHub</A>
                    </dd>
                    <dt className="text-ink-muted">Search</dt>
                    <dd className="text-ink-soft">
                        <A href="https://huggingface.co/docs/transformers.js/index">transformers.js</A> and{' '}
                        <A href="https://www.sbert.net/">sentence-transformers</A>, using{' '}
                        <A href="https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2">all-MiniLM-L6-v2</A>
                    </dd>
                    <dt className="text-ink-muted">Built with</dt>
                    <dd className="text-ink-soft">
                        <A href="https://nextjs.org/">Next.js</A>, deployed on Vercel.{' '}
                        <A href="https://github.com/nqureshi/ev-winners">Source</A>
                    </dd>
                </dl>
            </div>
            <div className="border-t border-paper-line">
                <div className="mx-auto flex max-w-5xl flex-col gap-2 px-5 py-5 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
                    <p>Not affiliated with Emergent Ventures or the Mercatus Center.</p>
                    <p>
                        Press <kbd className="rounded border border-paper-line bg-white px-1.5 py-0.5 font-sans text-[11px] text-ink-soft">/</kbd> to jump to search.
                    </p>
                </div>
            </div>
        </footer>
    )
}
