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

// Parses the user-entered personal links to a string and returns 
// an array of valid URLs. If none, returns null
const getFormattedPersonalLinks = (links: string | null) => {
  if (!links || links == "" || links === " " || links === "-") {
    return null;
  }

  return links.trim().split(/\s+/).map(link => formatLink(link));
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
        header: "MR Link",
        cell: (cell) => {
            const link = formatLink(cell.row.original.link);
            return link ? <a className="underline" href={link} target="_blank" rel="noopener noreferrer">Link</a> : null;
        },
    },
    {
      accessorKey: "personal_links",
      header: "Personal Links",
      cell: (cell) => {
        const personalLinks = getFormattedPersonalLinks(cell.row.original.personal_links);

        return personalLinks?.map((personalLink, index) => (
          <span>
            <a className="underline" href={personalLink} target="_blank" rel="noopener noreferrer"> {index + 1}</a>
            {(index + 1) !== personalLinks.length ? "," : null}
          </span>
        ))
      },
    },
    {
        accessorKey: "description",
        header: "Description",
    },
];
