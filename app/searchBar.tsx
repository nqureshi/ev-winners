"use client"

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import Link from 'next/link'
import { Badge, badgeVariants } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SearchBar() {
    const BADGES = [
        'Progress studies', 'Climate change', 'AI', 'Career development', 'Podcasts', 'Blogs and Substacks', 'Biotech',
        'Space', 'Mental health', 'Education', 'Cities', 'Robotics', 'Economics', 'Virtual reality',
        'Startups', 'Venture capital'
    ]

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    function handleSearch(term: string) {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        replace(`${pathname}?${params.toString()}`);
    }

    return (
        <>
            <h2 className="font-semibold mb-2">Semantic search over every Emergent Ventures winner</h2>
            <p className="mb-4 text-sm">
                This site uses semantic similarity to search all Emergent Ventures grantees. This search bar doesn't need you to get the keywords exactly right, only close enough, to find them.
            </p>
            <p className="mb-4 text-sm">
                You can search for something very specific like "Ukraine" or "career development", or something very broad like
                "books" or "podcasts". Here are a few starting places:
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
                {BADGES.map((badgeText) => (
                    <Link
                        key={badgeText}
                        className={`badge ${badgeVariants({ variant: "secondary" })}`}
                        href={`/?query=${badgeText}`}
                    >
                        {badgeText}
                    </Link>
                ))}
            </div >
            <div>
                <form onSubmit={handleSearch} className="flex">
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