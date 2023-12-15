import Image from 'next/image'
import Link from "next/link"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select"

import { promises as fs } from 'fs';
import { Winner, columns } from "./columns"

import SearchBar from "./searchBar"
import WinnersTable from "./winnersTable"

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const query = searchParams?.query || '';
  const file = await fs.readFile(process.cwd() + '/data/ev-winners-with-embeddings.json', 'utf8');
  const data = JSON.parse(file);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Emergent Ventures Winners</h1>
        <div className="flex space-x-4">
          <Link className="text-blue-600" href="#">
            about
          </Link>
          <Link className="text-blue-600" href="#">
            github
          </Link>
        </div>
      </div>
      <div className="bg-[#00c79f] p-4 rounded-lg mb-6 text-black">
        <SearchBar />
      </div>
      <div>
        <WinnersTable columns={columns} data={data} />
      </div>
    </div>
  )
}