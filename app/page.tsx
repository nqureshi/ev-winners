import Image from 'next/image'
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select"
import WinnersTable from "./winnersTable"
import { promises as fs } from 'fs';

export default async function Home() {
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
          <Badge variant="secondary">Nuclear</Badge>
        </div>
        <div className="flex">
          <Input className="flex-1 mr-2" placeholder="Search projects, ideas or people..." />
          <Button>Search</Button>
        </div>
      </div>
      <div className="flex items-center mb-4 w-1/4">
        <Select className="w-16">
          <SelectTrigger id="batch">
            <SelectValue placeholder="Filter by cohort..." />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="w09">Cohort 1</SelectItem>
            <SelectItem value="s09">Cohort 2</SelectItem>
            <SelectItem value="w10">Cohort 3</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <WinnersTable data={data} />
      </div>
    </div>
  )
}