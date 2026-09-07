"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import SearchBar from "./searchBar"
import WinnersList from "./winnersList"
import { Track, Winner, compareCohorts, inTracks, matchNames, parseTracks, sameName } from "./types"

export type Stats = {
    winners: number
    cohorts: number
    firstYear: string
    latestDate: string
    latestLink: string | null
}

async function fetchSimilarity(query: string, tracks: Track[]): Promise<Winner[] | null> {
    try {
        const params = new URLSearchParams({ query })
        if (tracks.length) params.set('tracks', tracks.join(','))
        const response = await fetch(`/api/similarity?${params}`, { cache: 'no-store' })
        if (!response.ok) throw new Error(`Similarity request failed: ${response.status}`)
        const data = await response.json()
        return Array.isArray(data.results) ? data.results : null
    } catch (error) {
        console.error('Error fetching similarity:', error)
        return null
    }
}

export default function Container({ data, stats }: { data: Winner[]; stats: Stats }) {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const router = useRouter()

    // Two mutually exclusive modes, both driven by the URL:
    //   ?query=… semantic search   ?name=… a single winner picked from the typeahead
    const query = (searchParams.get('query') || '').trim()
    const selectedName = (searchParams.get('name') || '').trim()
    // ?tracks=india,africa widens semantic search beyond the main cohorts.
    // Name search ignores it and always covers every winner.
    const tracksParam = searchParams.get('tracks') || ''
    const tracks = useMemo(() => parseTracks(tracksParam), [tracksParam])

    const [results, setResults] = useState<Winner[] | null>(null)
    const [loading, setLoading] = useState(query !== '')
    const [error, setError] = useState(false)

    const cohorts = useMemo(
        () => Array.from(new Set(data.map((w) => w.batch))).sort(compareCohorts),
        [data]
    )

    // Winners whose name closely matches the semantic query, surfaced above the results.
    const nameMatches = useMemo(
        () => (query.length >= 3 ? matchNames(data, query, 5, 2) : []),
        [data, query]
    )

    // How many winners the semantic search ranks, given the selected tracks.
    const searchPool = useMemo(() => data.filter((w) => inTracks(w, tracks)).length, [data, tracks])

    const nameRows = useMemo(
        () => (selectedName ? data.filter((w) => sameName(w.name, selectedName)) : null),
        [data, selectedName]
    )

    useEffect(() => {
        if (!query) {
            setResults(null)
            setLoading(false)
            setError(false)
            return
        }
        let cancelled = false
        setLoading(true)
        setError(false)
        fetchSimilarity(query, tracks).then((res) => {
            if (cancelled) return
            if (res) {
                setResults(res)
            } else {
                setError(true)
            }
            setLoading(false)
        })
        return () => {
            cancelled = true
        }
    }, [query, tracks])

    const navigate = useCallback(
        (updates: Record<string, string>) => {
            const params = new URLSearchParams(searchParams.toString())
            for (const [key, value] of Object.entries(updates)) {
                if (value) params.set(key, value)
                else params.delete(key)
            }
            const qs = params.toString()
            router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
        },
        [searchParams, pathname, router]
    )

    const setQuery = useCallback((term: string) => navigate({ query: term.trim(), name: '' }), [navigate])
    const setName = useCallback((name: string) => navigate({ name: name.trim(), query: '' }), [navigate])
    const clear = useCallback(() => navigate({ query: '', name: '' }), [navigate])
    const setTracks = useCallback((next: Track[]) => navigate({ tracks: next.join(',') }), [navigate])

    return (
        <>
            <SearchBar
                data={data}
                query={query}
                selectedName={selectedName}
                onSearch={setQuery}
                onSelectName={setName}
                onClear={clear}
                stats={stats}
                loading={loading}
                tracks={tracks}
                onTracksChange={setTracks}
            />
            <WinnersList
                data={nameRows ?? results ?? data}
                total={data.length}
                searchPool={searchPool}
                tracks={tracks}
                cohorts={cohorts}
                query={query}
                selectedName={selectedName}
                nameMatches={nameMatches}
                loading={loading}
                error={error}
                onClear={clear}
                onSelectName={setName}
                onRetry={() => {
                    setError(false)
                    setLoading(true)
                    fetchSimilarity(query, tracks).then((res) => {
                        if (res) setResults(res)
                        else setError(true)
                        setLoading(false)
                    })
                }}
            />
        </>
    )
}
