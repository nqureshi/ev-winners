"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowDownUp, ArrowUpRight, Search, X } from "lucide-react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Winner, cohortLabel, formatDate, formatLink } from "./types"

const ALL_COHORTS = "__all__"
const PAGE_SIZE = 100

interface WinnersListProps {
    data: Winner[]
    total: number
    cohorts: string[]
    query: string
    loading: boolean
    error: boolean
    onClear: () => void
    onRetry: () => void
}

export default function WinnersList({ data, total, cohorts, query, loading, error, onClear, onRetry }: WinnersListProps) {
    const [nameFilter, setNameFilter] = useState('')
    const [cohort, setCohort] = useState(ALL_COHORTS)
    const [newestFirst, setNewestFirst] = useState(true)
    const [visible, setVisible] = useState(PAGE_SIZE)

    const searching = query !== ''

    const filtered = useMemo(() => {
        const needle = nameFilter.trim().toLowerCase()
        let rows = data.filter((w) => {
            if (cohort !== ALL_COHORTS && w.batch !== cohort) return false
            if (needle && !w.name.toLowerCase().includes(needle)) return false
            return true
        })
        // Semantic results keep their similarity order; the full list is sorted by date.
        if (!searching) {
            rows = [...rows].sort((a, b) => {
                const byDate = a.date_announced.localeCompare(b.date_announced) || a.id - b.id
                return newestFirst ? -byDate : byDate
            })
        }
        return rows
    }, [data, cohort, nameFilter, searching, newestFirst])

    // Reset the page window whenever the underlying list changes.
    useEffect(() => {
        setVisible(PAGE_SIZE)
    }, [data, cohort, nameFilter, newestFirst])

    const shown = filtered.slice(0, visible)
    const remaining = filtered.length - shown.length

    const topSimilarity = searching && data.length ? data[0].similarity ?? 0 : 0
    const hasFilters = nameFilter.trim() !== '' || cohort !== ALL_COHORTS

    return (
        <section aria-labelledby="results-heading" className="mx-auto max-w-5xl px-5 pb-20 sm:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="min-w-0">
                    <h2 id="results-heading" className="font-serif text-[1.7rem] leading-tight text-ink sm:text-3xl">
                        {searching ? (
                            <>
                                Closest matches for <em className="text-mr-700">&ldquo;{query}&rdquo;</em>
                            </>
                        ) : (
                            'All winners'
                        )}
                    </h2>
                    <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-muted">
                        {loading ? (
                            <span>Ranking {total.toLocaleString('en-US')} winners by similarity…</span>
                        ) : searching ? (
                            <span>
                                Top {data.length} of {total.toLocaleString('en-US')} by semantic similarity
                                {hasFilters && filtered.length !== data.length && `, ${filtered.length} shown`}
                            </span>
                        ) : (
                            <span className="tabular-nums">
                                {filtered.length === total
                                    ? `${total.toLocaleString('en-US')} grantees`
                                    : `${filtered.length.toLocaleString('en-US')} of ${total.toLocaleString('en-US')} grantees`}
                            </span>
                        )}
                        {searching ? (
                            <button
                                type="button"
                                onClick={onClear}
                                className="inline-flex items-center gap-1 rounded-md font-medium text-mr-700 underline-offset-2 hover:underline"
                            >
                                <X className="h-3.5 w-3.5" aria-hidden="true" />
                                Clear search
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setNewestFirst((v) => !v)}
                                className="inline-flex items-center gap-1 rounded-md font-medium text-ink-soft underline-offset-2 hover:text-ink hover:underline"
                            >
                                <ArrowDownUp className="h-3.5 w-3.5" aria-hidden="true" />
                                {newestFirst ? 'Newest first' : 'Oldest first'}
                            </button>
                        )}
                    </p>
                </div>

                <div className="flex gap-2">
                    <div className="relative min-w-0 flex-1 md:w-56 md:flex-none">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
                        <label htmlFor="name-filter" className="sr-only">Filter by name</label>
                        <input
                            id="name-filter"
                            type="text"
                            placeholder="Filter by name"
                            value={nameFilter}
                            onChange={(event) => setNameFilter(event.target.value)}
                            className="h-10 w-full rounded-lg border border-paper-line bg-white pl-9 pr-3 text-sm text-ink shadow-card placeholder:text-ink-faint focus:border-mr-500 focus:outline-none focus:ring-2 focus:ring-mr-500/25"
                        />
                    </div>
                    <Select value={cohort} onValueChange={setCohort}>
                        <SelectTrigger
                            aria-label="Filter by cohort"
                            className={cn(
                                "h-10 w-[9.5rem] shrink-0 rounded-lg border-paper-line bg-white text-sm shadow-card focus:ring-2 focus:ring-mr-500/25 focus:ring-offset-0 sm:w-44",
                                cohort !== ALL_COHORTS && "border-mr-400 text-mr-800"
                            )}
                        >
                            <SelectValue placeholder="All cohorts" />
                        </SelectTrigger>
                        <SelectContent className="max-h-72 rounded-lg border-paper-line">
                            <SelectItem value={ALL_COHORTS}>All cohorts</SelectItem>
                            {cohorts.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {cohortLabel(option)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="mt-6">
                {loading ? (
                    <SkeletonRows />
                ) : error ? (
                    <EmptyState
                        title="Search is unavailable right now"
                        body="The similarity service didn’t respond. Try again in a moment, or browse the full list."
                        action={{ label: 'Try again', onClick: onRetry }}
                        secondary={{ label: 'Browse all winners', onClick: onClear }}
                    />
                ) : filtered.length === 0 ? (
                    <EmptyState
                        title="No winners match"
                        body={
                            searching
                                ? 'None of the closest matches fit these filters. Clear a filter or widen the search.'
                                : 'Try a different name or cohort.'
                        }
                        action={{
                            label: 'Clear filters',
                            onClick: () => {
                                setNameFilter('')
                                setCohort(ALL_COHORTS)
                            },
                        }}
                    />
                ) : (
                    <>
                        <ol className="divide-y divide-paper-line overflow-hidden rounded-2xl border border-paper-line bg-white shadow-card">
                            {shown.map((winner, index) => (
                                <WinnerRow
                                    key={winner.id}
                                    winner={winner}
                                    rank={searching ? data.indexOf(winner) + 1 : undefined}
                                    topSimilarity={topSimilarity}
                                    index={index}
                                />
                            ))}
                        </ol>
                        {remaining > 0 && (
                            <div className="mt-6 flex flex-col items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setVisible((v) => v + PAGE_SIZE)}
                                    className="inline-flex h-10 items-center rounded-lg border border-paper-line bg-white px-4 text-sm font-medium text-ink-soft shadow-card transition-colors hover:border-mr-300 hover:bg-mr-50 hover:text-mr-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mr-500"
                                >
                                    Show {Math.min(PAGE_SIZE, remaining)} more
                                </button>
                                <p className="text-xs tabular-nums text-ink-faint">
                                    Showing {shown.length.toLocaleString('en-US')} of {filtered.length.toLocaleString('en-US')}
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    )
}

function WinnerRow({
    winner,
    rank,
    topSimilarity,
    index,
}: {
    winner: Winner
    rank?: number
    topSimilarity: number
    index: number
}) {
    const link = formatLink(winner.link)
    const similarity = winner.similarity ?? 0
    const matchWidth = topSimilarity > 0 ? Math.max(12, Math.round((similarity / topSimilarity) * 100)) : 0

    return (
        <li
            className="group relative px-5 py-4 transition-colors hover:bg-mr-50/60 sm:px-6 sm:py-5"
            style={index < 12 ? { animationDelay: `${index * 30}ms` } : undefined}
        >
            <div className={cn("sm:grid sm:gap-6 lg:gap-10", "sm:grid-cols-[13.5rem_minmax(0,1fr)] lg:grid-cols-[16rem_minmax(0,1fr)]")}>
                <div className="min-w-0">
                    <h3 className="font-serif text-[1.35rem] leading-[1.15] text-ink sm:text-2xl">
                        {rank !== undefined && (
                            <span className="mr-2 text-ink-faint tabular-nums" aria-label={`Rank ${rank}`}>
                                {rank}.
                            </span>
                        )}
                        {link ? (
                            <a
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-sm transition-colors hover:text-mr-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mr-500"
                            >
                                {winner.name}
                                <ArrowUpRight
                                    className="ml-0.5 inline-block h-4 w-4 -translate-y-0.5 text-ink-faint opacity-60 transition-all group-hover:text-mr-600 group-hover:opacity-100"
                                    aria-hidden="true"
                                />
                                <span className="sr-only"> (announcement post)</span>
                            </a>
                        ) : (
                            winner.name
                        )}
                    </h3>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-muted">
                        <span className="rounded-md bg-paper-soft px-1.5 py-0.5 font-medium text-ink-soft">
                            {cohortLabel(winner.batch)}
                        </span>
                        <span className="tabular-nums">{formatDate(winner.date_announced)}</span>
                        {rank !== undefined && (
                            <span className="inline-flex items-center gap-1.5" title={`Similarity ${similarity.toFixed(2)}`}>
                                <span className="h-1 w-10 overflow-hidden rounded-full bg-paper-soft" aria-hidden="true">
                                    <span className="block h-full rounded-full bg-mr-500" style={{ width: `${matchWidth}%` }} />
                                </span>
                                <span className="sr-only">Similarity {similarity.toFixed(2)}</span>
                            </span>
                        )}
                    </div>
                </div>

                <div className="mt-2.5 min-w-0 sm:mt-0.5">
                    {winner.description ? (
                        <p className="text-[15px] leading-relaxed text-ink-soft">{winner.description}</p>
                    ) : (
                        <p className="text-[15px] italic text-ink-faint">No description recorded.</p>
                    )}
                    {(winner.type || winner.career_stage) && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                            {winner.type && <Tag>{winner.type}</Tag>}
                            {winner.career_stage && <Tag>{winner.career_stage === 'Middle' ? 'Middle school' : winner.career_stage}</Tag>}
                        </div>
                    )}
                </div>
            </div>
        </li>
    )
}

function Tag({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center rounded-full border border-mr-100 bg-mr-50 px-2 py-0.5 text-[11px] font-medium text-mr-800">
            {children}
        </span>
    )
}

function EmptyState({
    title,
    body,
    action,
    secondary,
}: {
    title: string
    body: string
    action: { label: string; onClick: () => void }
    secondary?: { label: string; onClick: () => void }
}) {
    return (
        <div className="rounded-2xl border border-dashed border-paper-line bg-white/60 px-6 py-14 text-center">
            <p className="font-serif text-2xl text-ink">{title}</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">{body}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
                <button
                    type="button"
                    onClick={action.onClick}
                    className="inline-flex h-9 items-center rounded-lg bg-mr-500 px-3.5 text-sm font-semibold text-mr-900 transition-colors hover:bg-mr-400"
                >
                    {action.label}
                </button>
                {secondary && (
                    <button
                        type="button"
                        onClick={secondary.onClick}
                        className="inline-flex h-9 items-center rounded-lg border border-paper-line bg-white px-3.5 text-sm font-medium text-ink-soft transition-colors hover:bg-paper-soft"
                    >
                        {secondary.label}
                    </button>
                )}
            </div>
        </div>
    )
}

function SkeletonRows({ count = 8 }: { count?: number }) {
    return (
        <ol aria-busy="true" aria-label="Loading results" className="divide-y divide-paper-line overflow-hidden rounded-2xl border border-paper-line bg-white shadow-card">
            {Array.from({ length: count }).map((_, i) => (
                <li key={i} className="px-5 py-4 sm:grid sm:grid-cols-[13.5rem_minmax(0,1fr)] sm:gap-6 sm:px-6 sm:py-5 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10">
                    <div>
                        <div className="skeleton h-6 rounded-md" style={{ width: `${55 + ((i * 17) % 40)}%` }} />
                        <div className="mt-2.5 flex gap-2">
                            <div className="skeleton h-4 w-16 rounded-md" />
                            <div className="skeleton h-4 w-14 rounded-md" />
                        </div>
                    </div>
                    <div className="mt-3 space-y-2 sm:mt-0.5">
                        <div className="skeleton h-4 rounded-md" style={{ width: `${70 + ((i * 23) % 30)}%` }} />
                        <div className="skeleton h-4 rounded-md" style={{ width: `${35 + ((i * 31) % 45)}%` }} />
                    </div>
                </li>
            ))}
        </ol>
    )
}

/** Full-page fallback used while the search-param-aware client tree hydrates. */
export function ResultsSkeleton() {
    return (
        <div className="mx-auto max-w-5xl px-5 pb-20 pt-12 sm:px-8 sm:pt-20">
            <div className="skeleton h-4 w-48 rounded-md" />
            <div className="skeleton mt-5 h-14 max-w-2xl rounded-lg" />
            <div className="skeleton mt-8 h-16 rounded-2xl" />
            <div className="mt-14">
                <SkeletonRows count={6} />
            </div>
        </div>
    )
}
