import Image from 'next/image'
import Link from "next/link"

import { Suspense } from 'react'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select"

import { promises as fs } from 'fs';
import { Winner, columns } from "./columns"

import SearchBar from "./searchBar"
import WinnersTable from "./winnersTable"
import { getSortedData } from './utils/getSortedData'
import Footer from "./footer"

const path = require('path');

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const query = searchParams?.query || '';

  // get full dataset to render in Table, this is rendered on first load
  const file = await fs.readFile(path.resolve(process.cwd() + '/app/data/ev-winners-with-embeddings.json'), 'utf8');
  const data = JSON.parse(file);

  // this is rendered in the Table
  let effectiveData = data;

  // if a semantic search query is entered, compute cosine similarity + return top 20 matches
  /*
  if (query.trim() !== '') {
    const newData = await getSortedData(data, embedding);
    effectiveData = newData;
  }*/

  return (
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
      <Suspense>
        <div className="bg-[#00c79f] p-4 rounded-lg mb-6 text-black">
        <SearchBar />
      </div>
      </Suspense>
      <div>
        <WinnersTable columns={columns} data={effectiveData} />
      </div>
      <div id="footer" className="text-gray-500 mt-4 w-4/5">
        <Footer />
      </div>
    </div>
  )
}