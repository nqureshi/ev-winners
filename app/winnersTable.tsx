"use client"

import { TableHeader, TableCell, TableRow, TableBody, Table, TableHead } from "@/components/ui/table"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    ColumnFiltersState,
    getFilteredRowModel,
} from "@tanstack/react-table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { usePathname } from "next/navigation"

interface WinnersTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    query: string
}


export default function WinnersTable<TData, TValue>({
    columns,
    data,
    query,
}: WinnersTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters,
        },
    })

    const getBatchOptions = () => {
        return Array.from(new Set(data.map((winner: any) => winner.batch)));
    };
    
    const batchOptions = getBatchOptions();
    const pathname = usePathname();
    const handleClearSearch = () => {
        location.replace(`${pathname}?query=`);
    };

// Helper function to check if a string is numeric
function isNumeric(str: any) {
    return !isNaN(str) && !isNaN(parseFloat(str));
}

// For sorting cohorts
function customSort(a: any, b: any) {
    const isANumeric = isNumeric(a);
    const isBNumeric = isNumeric(b);

    if (isANumeric && isBNumeric) {
        return parseInt(a) - parseInt(b);
    }

    else if (isANumeric) {
        return -1;
    }

    else if (isBNumeric) {
        return 1;
    }

    else {
        return a.localeCompare(b);
    }
}

    return (
        <>
            <div className="flex items-center justify-start">
                <div className="mb-4 w-1/4 mr-8">
                    <Input
                        placeholder="Search by name..."
                        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("name")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                </div>
                <div className="mb-4 w-1/4 mr-8">
                    <Select
                        onValueChange={(value) => {
                            if (value === "CLEAR_SELECTION") {
                                table.getColumn("batch")?.setFilterValue("");
                            } else {
                                table.getColumn("batch")?.setFilterValue(value);
                            }
                        }}
                        defaultValue={(table.getColumn("batch")?.getFilterValue() as string) ?? ""}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Choose cohort..." />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem key="clear_option" value="CLEAR_SELECTION">
                            All cohorts
                        </SelectItem>
                        {batchOptions.sort(customSort).map((option) => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="mb-4 text-gray-500 text-sm mr-2">
                    {query !== '' && (
                        <>
                            Showing top 20 results for &ldquo;{query}&rdquo; by similarity.
                            <span className="underline cursor-pointer ml-2" onClick={handleClearSearch}>
                                Click to clear search.
                            </span>
                        </>
                    )}
                </div>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}