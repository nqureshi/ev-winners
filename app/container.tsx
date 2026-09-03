"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import SearchBar from "./searchBar"
import WinnersList from "./winnersList"
import { Winner, compareCohorts } from "./types"

export type Stats = {
    winners: number
    cohorts: number
    firstYear: string
    latestDate: string
    latestLink: string | null
}

async function fetchSimilarity(query: string): Promise<Winner[] | null> {
    try {
        const response = await fetch(`/api/similarity?query=${encodeURIComponent(query)}`, { cache: 'no-store' })
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

    const query = (searchParams.get('query') || '').trim()

    const [results, setResults] = useState<Winner[] | null>(null)
    const [loading, setLoading] = useState(query !== '')
    const [error, setError] = useState(false)

    const cohorts = useMemo(
        () => Array.from(new Set(data.map((w) => w.batch))).sort(compareCohorts),
        [data]
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
        fetchSimilarity(query).then((res) => {
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
    }, [query])

    const setQuery = useCallback(
        (term: string) => {
            const params = new URLSearchParams(searchParams.toString())
            const trimmed = term.trim()
            if (trimmed) {
                params.set('query', trimmed)
            } else {
                params.delete('query')
            }
            const qs = params.toString()
            router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
        },
        [searchParams, pathname, router]
    )

    return (
        <>
            <SearchBar query={query} onSearch={setQuery} stats={stats} loading={loading} />
            <WinnersList
                data={results ?? data}
                total={data.length}
                cohorts={cohorts}
                query={query}
                loading={loading}
                error={error}
                onClear={() => setQuery('')}
                onRetry={() => {
                    // Re-run the effect by nudging state; the query itself is unchanged.
                    setError(false)
                    setLoading(true)
                    fetchSimilarity(query).then((res) => {
                        if (res) setResults(res)
                        else setError(true)
                        setLoading(false)
                    })
                }}
            />
        </>
    )
}
