"use client"

import SearchBar from "./searchBar"
import WinnersTable from "./winnersTable"
import { Winner, columns } from "./columns"

export default function Container({ data }: Winner[]) {
    return(
        <>
            <div className="bg-[#00c79f] p-4 rounded-lg mb-6 text-black">
                <SearchBar />
            </div>
            <div>
                <WinnersTable columns={columns} data={data} />
            </div>
        </>
    )
}