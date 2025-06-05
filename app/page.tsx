import Image from 'next/image'
import Link from "next/link"


// UI COMPONENTS
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select"

import { promises as fs } from 'fs';
import { Winner, columns } from "./columns"

// COMPONENTS
import Footer from "./footer"
import Container from "./container"

export default async function Page() {

  // get full dataset to render in Table, this is rendered on first load
  const path = require('path');
  const file = await fs.readFile(path.resolve(process.cwd() + '/app/data/ev-winners-with-embeddings.json'), 'utf8');
  const data = JSON.parse(file);
 
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Emergent Ventures Winners</h1>
        <div className="flex space-x-4">
          <Link href="#footer" className="text-blue-600">
            about
          </Link>
          <Link className="text-blue-600" href="https://github.com/nqureshi/ev-winners">
            github
          </Link>
          <Link className="text-blue-600" href="https://github.com/nqureshi/ev-search-python/blob/main/data/ev-winners.csv">
            data
          </Link>
        </div>
      </div>
      <div>
        <Container data={data} />
      </div>
      <div id="footer" className="text-gray-500 mt-4 w-4/5">
        <Footer />
      </div>
    </div>
  )
}