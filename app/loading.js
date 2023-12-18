"use client"

import { Progress } from "@/components/ui/progress"
import { Badge, badgeVariants } from "@/components/ui/badge"
import Link from "next/link"
import Footer from "./footer"
import { BADGES } from "./searchBar"
import { useState, useEffect } from "react"

export default function LoadingSkeleton() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
        <>
        <div className="max-w-4xl mx-auto p-6 bg-white">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">Emergent Ventures Winners</h1>
                <div className="flex space-x-4">
                <Link href="#footer" className="text-blue-600">
                    about
                </Link>
                <Link className="text-blue-600" href="#">
                    github
                </Link>
                </div>
            </div>
            <div className="bg-[#00c79f] p-4 rounded-lg mb-6 text-black">
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
                        >
                            {badgeText}
                        </button>
                    ))}
                </div>
            </div>
            <div><p>Loading...</p></div>
            <div id="footer" className="text-gray-500 mt-4 w-4/5">
                <Footer />
            </div>
        </div>
        </>
    );
  }