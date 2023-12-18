"use client"

import SearchBar from "./searchBar"
import WinnersTable from "./winnersTable"
import { Winner, columns } from "./columns"
import { useState, useEffect, useMemo, Suspense } from "react"
import { getSortedData } from './utils/getSortedData'
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Progress } from "@/components/ui/progress"

async function fetchSimilarity(query: string) {
    const API_URL = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/api/similarity?query='
      : '/api/similarity?query=';
  
    try {
      const response = await fetch((API_URL + query), { cache: 'no-store' });
      const data = await response.json();
      // console.log(data); // Log the response
      return data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

export default function Container({ data }: any) {
    const searchParams = useSearchParams();
    const params = useMemo(() => new URLSearchParams(searchParams), [searchParams]);
    const arr: number[] = []
    const [embedding, setEmbedding] = useState(arr)
    const [renderedData, setRenderedData] = useState(data);
    
    // fetch the query embedding when a search is submitted
    useEffect(() => {
        const q = params.get('query') || '';
        if (q !== '') {
            fetchSimilarity(q)
                .then((res) => {
                    setEmbedding(res.message);
                })
                .catch((error) => {
                    console.error('Error fetching similarity:', error);
                });
        }
    }, [params]);

    // once query embedding is fetched, re-render data in the table
    useEffect(() => {
        if (embedding.length > 0) {
            setRenderedData(getSortedData(data, embedding));
        }
    }, [embedding, data]);

    return(
        <>
            <div className="bg-[#00c79f] p-4 rounded-lg mb-6 text-black">
                <SearchBar />
            </div>
            <p>The embedding is {embedding[0]}</p>
            <Progress value={33} /> 
            <Suspense fallback={<p>Loading...</p>}>
                <div>
                    <WinnersTable columns={columns} data={renderedData} />
                </div>
            </Suspense>
        </>
    )
}