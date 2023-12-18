"use client"

import { ColumnDef } from "@tanstack/react-table"

export type Winner = {
    id: number;
    name: string;
    batch: string;
    date_announced: string;
    link: string | null;
    description: string | null;
    type: string | null;
    career_stage: string | null;
    personal_links: string[] | null;
    personal_info: string | null;
    mr_posts: string[] | null;
    project_links: string[] | null;
    embedding_description: number[];
};

// Utility function to ensure the link has 'https://' prefix
const formatLink = (link: string | null) => {
    if (link && !link.startsWith('http://') && !link.startsWith('https://')) {
        return `https://${link}`;
    }
    return link;
};

export const columns: ColumnDef<Winner>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "batch",
        header: "Cohort",
    },
    {
        accessorKey: "link",
        header: "Link",
        cell: (cell) => {
            const link = formatLink(cell.row.original.link);
            return link ? <a className="underline" href={link} target="_blank" rel="noopener noreferrer">Link</a> : null;
        },
    },
    {
        accessorKey: "description",
        header: "Description",
    },
];
