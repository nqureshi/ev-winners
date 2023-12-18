"use client"

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import Link from 'next/link'
import { Badge, badgeVariants } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useMemo } from "react"
import { QrCode } from 'lucide-react';

export default function SearchBar() {
    const BADGES = [
        'Progress studies', 'Climate change', 'AI', 'Career development', 'Podcasts', 'Blogs and Substacks', 'Biotech',
        'Space', 'Mental health', 'Education', 'Cities', 'Robotics', 'Economics', 'Virtual reality',
        'Startups', 'Venture capital'
    ]

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { push } = useRouter();
    const params = new URLSearchParams(searchParams);

    function handleSearch(term: string) {
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        push(`${pathname}?${params.toString()}`);
    }

    return (
        <>
            <h2 className="font-semibold mb-2">Semantic search over every Emergent Ventures winner</h2>
            <p className="mb-4 text-sm">
                This site uses semantic similarity to search all Emergent Ventures grantees. This search bar doesn&lsquo;t need you to get the keywords exactly right, only close enough, to find them.
            </p>
            <p className="mb-4 text-sm">
                You can search for something very specific like &ldquo;Ukraine&rdquo; or &ldquo;career development&rdquo;, or something very broad like
                &ldquo;books&rdquo; or &ldquo;podcasts&rdquo;. Here are a few starting places:
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
                {BADGES.map((badgeText) => (
                    <button
                        key={badgeText}
                        className={`badge ${badgeVariants({ variant: "secondary" })}`}
                        onClick={() => handleSearch(badgeText)}
                    >
                        {badgeText}
                    </button>
                ))}
            </div >
            <div>
                <form onSubmit={(event) => {
                    handleSearch((event.target as any)[0].value)
                }} className="flex">
                    <Input
                        className="flex-1 mr-2"
                        placeholder="Search projects, ideas, or fun things..."
                        name="query"
                        defaultValue={searchParams.get('query')?.toString()}
                    />
                    <Button type="submit">Search</Button>
                </form>
            </div>
        </>
    )
}