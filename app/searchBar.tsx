"use client"

import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function searchBar() {
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
                <Badge variant="secondary">Progress studies</Badge>
                <Badge variant="secondary">Climate change</Badge>
                <Badge variant="secondary">AI safety</Badge>
                <Badge variant="secondary">Career development</Badge>
                <Badge variant="secondary">Podcasts</Badge>
                <Badge variant="secondary">Blogs and Substacks</Badge>
                <Badge variant="secondary">Biotech</Badge>
            </div>
            <div className="flex">
                <Input className="flex-1 mr-2" placeholder="Search projects, ideas or people..." />
                <Button>Search</Button>
            </div>
        </>
    )
}