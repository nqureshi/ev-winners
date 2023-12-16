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
        accessorKey: "description",
        header: "Description",
    }
];
