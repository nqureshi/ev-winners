"use client"

import { useEffect, useId, useMemo, useRef, useState } from "react"
import { ArrowRight, CornerDownLeft, Loader2, Search, User, X } from "lucide-react"

import { cn } from "@/lib/utils"
import type { Stats } from "./container"
import { Winner, cohortLabel, matchNames } from "./types"

export const SUGGESTIONS = [
    'Progress studies', 'AI', 'Biotech', 'Climate change', 'Education', 'Startups',
    'Space', 'Cities', 'Economics', 'Mental health', 'Robotics', 'Podcasts',
    'Blogs and Substacks', 'Career development', 'Virtual reality', 'Venture capital',
]

const MOBILE_VISIBLE = 8

interface SearchBarProps {
    data: Winner[]
    query: string
    selectedName: string
    loading: boolean
    stats: Stats
    onSearch: (term: string) => void
    onSelectName: (name: string) => void
    onClear: () => void
}

export default function SearchBar({ data, query, selectedName, loading, stats, onSearch, onSelectName, onClear }: SearchBarProps) {
    const current = query || selectedName
    const [term, setTerm] = useState(current)
    const [showAll, setShowAll] = useState(false)
    const [open, setOpen] = useState(false)
    const [active, setActive] = useState(0)
    const inputRef = useRef<HTMLInputElement>(null)
    const formRef = useRef<HTMLFormElement>(null)
    const listId = useId()
    const [compact, setCompact] = useState(false)

    // Shorter placeholder on narrow screens so the nudge doesn't get truncated.
    useEffect(() => {
        const mq = window.matchMedia('(max-width: 639px)')
        const update = () => setCompact(mq.matches)
        update()
        mq.addEventListener('change', update)
        return () => mq.removeEventListener('change', update)
    }, [])

    const trimmed = term.trim()
    const names = useMemo(() => (trimmed ? matchNames(data, trimmed, 5) : []), [data, trimmed])
    // Option 0 is always "Search for …"; options 1..n are name matches.
    const optionCount = trimmed ? 1 + names.length : 0
    const showList = open && optionCount > 0

    // Keep the input in sync when the URL changes (chip click, back button).
    useEffect(() => {
        setTerm(current)
    }, [current])

    useEffect(() => {
        setActive(0)
    }, [trimmed])

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
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [])

    // Close the dropdown on outside click or tap.
    useEffect(() => {
        if (!open) return
        const onPointer = (event: PointerEvent) => {
            if (!formRef.current?.contains(event.target as Node)) setOpen(false)
        }
        document.addEventListener('pointerdown', onPointer)
        return () => document.removeEventListener('pointerdown', onPointer)
    }, [open])

    const choose = (index: number) => {
        setOpen(false)
        inputRef.current?.blur()
        if (index === 0) {
            onSearch(trimmed)
        } else {
            const winner = names[index - 1]
            if (winner) onSelectName(winner.name)
        }
    }

    const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'ArrowDown' && optionCount > 0) {
            event.preventDefault()
            setOpen(true)
            setActive((i) => (i + 1) % optionCount)
        } else if (event.key === 'ArrowUp' && optionCount > 0) {
            event.preventDefault()
            setOpen(true)
            setActive((i) => (i - 1 + optionCount) % optionCount)
        } else if (event.key === 'Escape') {
            if (showList) {
                event.preventDefault()
                setOpen(false)
            } else {
                inputRef.current?.blur()
            }
        }
    }

    return (
        <section className="relative">
            <div className="hero-grid absolute inset-0 -z-10 overflow-hidden" aria-hidden="true" />
            <div className="hero-glow absolute inset-x-0 top-0 -z-10 h-80 overflow-hidden" aria-hidden="true" />

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
                    This site collects every grantee in one place. Search by topic and it will find close matches even when
                    the exact words differ, or start typing a name to jump straight to someone.
                </p>

                <div className="relative mt-8">
                    <form
                        ref={formRef}
                        role="search"
                        onSubmit={(event) => {
                            event.preventDefault()
                            if (!trimmed) {
                                onClear()
                                return
                            }
                            choose(showList ? active : 0)
                        }}
                        className={cn(
                            "group relative flex items-center rounded-2xl border border-paper-line bg-white shadow-search transition-[box-shadow,border-color] duration-200 focus-within:border-mr-500 focus-within:shadow-search-focus",
                            showList && "rounded-b-none border-b-transparent focus-within:border-b-transparent"
                        )}
                    >
                        <label htmlFor="semantic-search" className="sr-only">Search winners by topic or name</label>
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
                            autoCorrect="off"
                            spellCheck={false}
                            enterKeyHint="search"
                            role="combobox"
                            aria-expanded={showList}
                            aria-controls={listId}
                            aria-autocomplete="list"
                            aria-activedescendant={showList ? `${listId}-${active}` : undefined}
                            placeholder={compact ? "Search a topic, or type a name" : "Search a topic like “longevity research”, or type a winner’s name"}
                            value={term}
                            onChange={(event) => {
                                setTerm(event.target.value)
                                setOpen(true)
                            }}
                            onFocus={() => setOpen(true)}
                            onKeyDown={onInputKeyDown}
                            className="h-14 min-w-0 flex-1 bg-transparent px-3 text-base text-ink placeholder:text-ink-faint focus:outline-none sm:h-16 sm:text-lg"
                        />
                        {term && (
                            <button
                                type="button"
                                aria-label="Clear search"
                                onClick={() => {
                                    setTerm('')
                                    setOpen(false)
                                    if (current) onClear()
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

                        <ul
                            id={listId}
                            role="listbox"
                            aria-label="Search suggestions"
                            hidden={!showList}
                            className="absolute inset-x-[-1px] top-full z-30 overflow-hidden rounded-b-2xl border border-t-0 border-mr-500 bg-white pb-1.5 shadow-search-focus"
                        >
                            <li className="mx-1.5 border-t border-paper-line" role="presentation" />
                            <Option
                                id={`${listId}-0`}
                                active={active === 0}
                                onHover={() => setActive(0)}
                                onSelect={() => choose(0)}
                            >
                                <Search className="h-4 w-4 shrink-0 text-mr-600" aria-hidden="true" />
                                <span className="min-w-0 flex-1 truncate text-[15px] text-ink">
                                    Search for <span className="font-semibold">&ldquo;{trimmed}&rdquo;</span>
                                </span>
                                <span className="hidden shrink-0 text-xs text-ink-faint sm:inline">by topic</span>
                                <CornerDownLeft className="hidden h-3.5 w-3.5 shrink-0 text-ink-faint sm:block" aria-hidden="true" />
                            </Option>
                            {names.length > 0 && (
                                <>
                                    <li role="presentation" className="mx-1.5 mt-1 border-t border-paper-line px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                                        Winners
                                    </li>
                                    {names.map((winner, index) => (
                                        <Option
                                            key={winner.id}
                                            id={`${listId}-${index + 1}`}
                                            active={active === index + 1}
                                            onHover={() => setActive(index + 1)}
                                            onSelect={() => choose(index + 1)}
                                        >
                                            <User className="h-4 w-4 shrink-0 text-ink-faint" aria-hidden="true" />
                                            <span className="min-w-0 flex-1 truncate font-serif text-[17px] text-ink">{winner.name}</span>
                                            <span className="shrink-0 text-xs text-ink-muted">{cohortLabel(winner.batch)}</span>
                                        </Option>
                                    ))}
                                </>
                            )}
                        </ul>
                    </form>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                    <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-ink-faint">Try</span>
                    {SUGGESTIONS.map((suggestion, index) => {
                        const isActive = suggestion.toLowerCase() === query.toLowerCase()
                        return (
                            <button
                                key={suggestion}
                                type="button"
                                aria-pressed={isActive}
                                onClick={() => onSearch(suggestion)}
                                className={cn(
                                    "rounded-full border px-3 py-1 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mr-500 focus-visible:ring-offset-2",
                                    index >= MOBILE_VISIBLE && !showAll ? "hidden sm:inline-flex" : "inline-flex",
                                    isActive
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

function Option({
    id,
    active,
    onHover,
    onSelect,
    children,
}: {
    id: string
    active: boolean
    onHover: () => void
    onSelect: () => void
    children: React.ReactNode
}) {
    return (
        <li
            id={id}
            role="option"
            aria-selected={active}
            onMouseEnter={onHover}
            onMouseDown={(event) => event.preventDefault()}
            onClick={onSelect}
            className={cn(
                "mx-1.5 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-colors sm:py-2",
                active ? "bg-mr-50" : "hover:bg-paper-soft"
            )}
        >
            {children}
        </li>
    )
}
