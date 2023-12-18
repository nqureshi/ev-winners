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
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(10); 
    
    // fetch the query embedding when a search is submitted
    useEffect(() => {
        const q = params.get('query') || '';
        if (q !== '') {
            setLoading(true);
            setQuery(q)
            fetchSimilarity(q)
                .then((res) => {
                    setEmbedding(res.message);
                })
                .catch((error) => {
                    console.error('Error fetching similarity:', error);
                });
        }
    }, [params]);

    // loading progress bar animation
    useEffect(() => {
      let timer: NodeJS.Timeout | undefined;
      if (loading) {
        timer = setInterval(() => {
          setProgress((oldProgress) => {
            if (oldProgress === 100) {
              return 0; // Reset progress to 0 when it reaches 100
            }
            return oldProgress + 10; // Increment progress
          });
        }, 5);
      } else {
        clearInterval(timer); // Clear interval when loading is set to false externally
      }
      return () => clearInterval(timer); // Cleanup interval on component unmount
    }, [loading]);  

    // once query embedding is fetched, re-render data in the table
    useEffect(() => {
        if (embedding.length > 0) {
            setRenderedData(getSortedData(data, embedding));
            setLoading(false);
        }
    }, [embedding, data]);

    return(
        <>
            <div className="bg-[#00c79f] p-4 rounded-lg mb-6 text-black">
                <SearchBar />
            </div>
            {loading && <Progress value={progress} className="w-[60%]" />}
            <Suspense fallback={<p>Loading...</p>}>
                <div>
                    <WinnersTable columns={columns} data={renderedData} query={query} />
                </div>
            </Suspense>
        </>
    )
}