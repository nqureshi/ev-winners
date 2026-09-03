export type Winner = {
    id: number;
    name: string;
    batch: string;
    date_announced: string;
    link: string | null;
    description: string | null;
    type: string | null;
    career_stage: string | null;
    personal_links: string[] | string | null;
    personal_info: string | null;
    mr_posts: string[] | string | null;
    project_links: string[] | string | null;
    embedding_description: number[];
    /** Only present on semantic search results. */
    similarity?: number;
};

/** Ensure a link has a protocol so it opens as an external URL. */
export const formatLink = (link: string | null) => {
    if (!link) return null;
    if (!link.startsWith('http://') && !link.startsWith('https://')) {
        return `https://${link}`;
    }
    return link;
};

const isNumeric = (str: string) => !isNaN(Number(str)) && !isNaN(parseFloat(str));

/** Sort cohorts numerically, with named tranches (e.g. "India 2") after the numbers. */
export function compareCohorts(a: string, b: string) {
    const aNum = isNumeric(a);
    const bNum = isNumeric(b);
    if (aNum && bNum) return parseInt(a) - parseInt(b);
    if (aNum) return -1;
    if (bNum) return 1;
    return a.localeCompare(b);
}

/** "Cohort 12" for numeric batches, otherwise the batch name as-is. */
export function cohortLabel(batch: string) {
    return isNumeric(batch) ? `Cohort ${batch}` : batch;
}

export function formatDate(iso: string) {
    const d = new Date(iso + 'T00:00:00Z');
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
}

export function formatLongDate(iso: string) {
    const d = new Date(iso + 'T00:00:00Z');
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

const normalize = (s: string) =>
    s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

export type NameMatch = { winner: Winner; score: number };

/**
 * Match winners by name. Scores: 3 = name starts with the term, 2 = every
 * term word is a prefix of some name word ("tyler c" → "Tyler Cowen"),
 * 1 = plain substring. Repeated names are collapsed to one entry.
 */
export function matchNames(data: Winner[], term: string, limit = 5, minScore = 1): Winner[] {
    const q = normalize(term);
    if (q.length < 2) return [];
    const tokens = q.split(/\s+/).filter(Boolean);
    const seen = new Set<string>();
    const scored: NameMatch[] = [];
    for (const winner of data) {
        const n = normalize(winner.name);
        if (seen.has(n)) continue;
        let score = 0;
        if (n.startsWith(q)) {
            score = 3;
        } else {
            const words = n.split(/[\s,\-()]+/);
            if (tokens.every((t) => words.some((w) => w.startsWith(t)))) score = 2;
            else if (q.length >= 3 && n.includes(q)) score = 1;
        }
        if (score >= minScore) {
            seen.add(n);
            scored.push({ winner, score });
        }
    }
    scored.sort((a, b) => b.score - a.score || a.winner.name.localeCompare(b.winner.name));
    return scored.slice(0, limit).map((s) => s.winner);
}

export const sameName = (a: string, b: string) => normalize(a) === normalize(b);
