"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight, Loader2, Search, X } from "lucide-react"

import { cn } from "@/lib/utils"
import type { Stats } from "./container"

export const SUGGESTIONS = [
    'Progress studies', 'AI', 'Biotech', 'Climate change', 'Education', 'Startups',
    'Space', 'Cities', 'Economics', 'Mental health', 'Robotics', 'Podcasts',
    'Blogs and Substacks', 'Career development', 'Virtual reality', 'Venture capital',
]

const MOBILE_VISIBLE = 8

interface SearchBarProps {
    query: string
    loading: boolean
    stats: Stats
    onSearch: (term: string) => void
}

export default function SearchBar({ query, loading, stats, onSearch }: SearchBarProps) {
    const [term, setTerm] = useState(query)
    const [showAll, setShowAll] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    // Keep the input in sync when the URL changes (chip click, back button).
    useEffect(() => {
        setTerm(query)
    }, [query])

    // "/" focuses the search box, Escape blurs it.
    useEffect(() => {
        const onKey = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement | null
            const typing = target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
            if (event.key === '/' && !typing && !event.metaKey && !event.ctrlKey && !event.altKey) {
                event.preventDefault()
                inputRef.current?.focus()
                inputRef.current?.select()
            }
            if (event.key === 'Escape' && document.activeElement === inputRef.current) {
                inputRef.current?.blur()
            }
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [])

    return (
        <section className="relative overflow-hidden">
            <div className="hero-grid absolute inset-0 -z-10" aria-hidden="true" />
            <div className="hero-glow absolute inset-x-0 top-0 -z-10 h-80" aria-hidden="true" />

            <div className="mx-auto max-w-5xl px-5 pb-10 pt-12 sm:px-8 sm:pb-14 sm:pt-20">
                <p className="flex items-center gap-2 text-[13px] font-medium tracking-wide text-ink-muted">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-mr-500" aria-hidden="true" />
                    <span className="tabular-nums">
                        {stats.winners.toLocaleString('en-US')} winners
                        <span className="mx-1.5 text-ink-faint">·</span>
                        {stats.cohorts} cohorts
                        <span className="mx-1.5 text-ink-faint">·</span>
                        {stats.firstYear}–{stats.latestDate.slice(0, 4)}
                    </span>
                </p>

                <h1 className="mt-4 max-w-3xl text-balance font-serif text-[2.75rem] leading-[1.02] tracking-[-0.01em] text-ink sm:text-6xl md:text-[4.5rem]">
                    Every Emergent Ventures winner,{' '}
                    <em className="text-mr-700">searchable by idea.</em>
                </h1>

                <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink-soft sm:text-[17px]">
                    <a className="link-underline text-ink" href="https://www.mercatus.org/emergent-ventures" target="_blank" rel="noopener noreferrer">Emergent Ventures</a>{' '}
                    is <a className="link-underline text-ink" href="https://en.wikipedia.org/wiki/Tyler_Cowen" target="_blank" rel="noopener noreferrer">Tyler Cowen</a>&rsquo;s
                    grant program at the Mercatus Center, funding moonshots and highly ambitious ideas to improve society.
                    This site collects every grantee in one place. The search runs on embeddings, so describe what you&rsquo;re looking for
                    and it will find close matches even when the exact words differ.
                </p>

                <form
                    role="search"
                    onSubmit={(event) => {
                        event.preventDefault()
                        onSearch(term)
                        inputRef.current?.blur()
                    }}
                    className="group relative mt-8 flex items-center rounded-2xl border border-paper-line bg-white shadow-search transition-[box-shadow,border-color] duration-200 focus-within:border-mr-500 focus-within:shadow-search-focus"
                >
                    <label htmlFor="semantic-search" className="sr-only">Search winners by topic</label>
                    <Search
                        className="ml-4 h-5 w-5 shrink-0 text-ink-faint transition-colors group-focus-within:text-mr-600"
                        aria-hidden="true"
                    />
                    <input
                        id="semantic-search"
                        ref={inputRef}
                        type="text"
                        name="query"
                        autoComplete="off"
                        enterKeyHint="search"
                        placeholder="Try “longevity research” or “tools for writers”"
                        value={term}
                        onChange={(event) => setTerm(event.target.value)}
                        className="h-14 min-w-0 flex-1 bg-transparent px-3 text-base text-ink placeholder:text-ink-faint focus:outline-none sm:h-16 sm:text-lg"
                    />
                    {term && (
                        <button
                            type="button"
                            aria-label="Clear search"
                            onClick={() => {
                                setTerm('')
                                if (query) onSearch('')
                                inputRef.current?.focus()
                            }}
                            className="mr-1 hidden h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-paper-soft hover:text-ink sm:inline-flex"
                        >
                            <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="m-2 inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-mr-500 px-4 text-sm font-semibold text-mr-900 transition-colors hover:bg-mr-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mr-600 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-80 sm:h-12 sm:px-5 sm:text-[15px]"
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        ) : (
                            <ArrowRight className="hidden h-4 w-4 sm:block" aria-hidden="true" />
                        )}
                        <span>Search</span>
                    </button>
                </form>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                    <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-ink-faint">Try</span>
                    {SUGGESTIONS.map((suggestion, index) => {
                        const active = suggestion.toLowerCase() === query.toLowerCase()
                        return (
                            <button
                                key={suggestion}
                                type="button"
                                aria-pressed={active}
                                onClick={() => onSearch(suggestion)}
                                className={cn(
                                    "rounded-full border px-3 py-1 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mr-500 focus-visible:ring-offset-2",
                                    index >= MOBILE_VISIBLE && !showAll ? "hidden sm:inline-flex" : "inline-flex",
                                    active
                                        ? "border-mr-500 bg-mr-500 text-mr-900"
                                        : "border-paper-line bg-white/80 text-ink-soft hover:border-mr-300 hover:bg-mr-50 hover:text-mr-800"
                                )}
                            >
                                {suggestion}
                            </button>
                        )
                    })}
                    {!showAll && (
                        <button
                            type="button"
                            onClick={() => setShowAll(true)}
                            className="inline-flex rounded-full px-2 py-1 text-[13px] font-medium text-mr-700 underline-offset-2 hover:underline sm:hidden"
                        >
                            +{SUGGESTIONS.length - MOBILE_VISIBLE} more
                        </button>
                    )}
                </div>
            </div>
        </section>
    )
}
