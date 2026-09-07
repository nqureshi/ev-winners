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
    // Named tranches are numbered too ("India 2" ... "India 18"), so compare
    // them naturally; a plain localeCompare puts "India 10" before "India 2".
    return a.localeCompare(b, undefined, { numeric: true });
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

/**
 * Which Emergent Ventures programme a cohort belongs to. The numbered cohorts
 * (plus the Progress Studies tranche) are "main"; the regional and prize
 * tranches are opt-in for semantic search so they don't crowd out the main
 * results, while name search always covers everyone.
 */
export type Track = 'main' | 'india' | 'africa' | 'covid';

export const OPTIONAL_TRACKS: { key: Exclude<Track, 'main'>; label: string }[] = [
    { key: 'india', label: 'India' },
    { key: 'africa', label: 'Africa & Caribbean' },
    { key: 'covid', label: 'Covid prizes' },
];

export const TRACK_LABELS: Record<Track, string> = {
    main: 'Main cohorts',
    india: 'India',
    africa: 'Africa & Caribbean',
    covid: 'Covid prizes',
};

export function trackOf(batch: string): Track {
    if (batch.startsWith('India')) return 'india';
    if (batch.startsWith('Africa')) return 'africa';
    if (batch.startsWith('Covid')) return 'covid';
    return 'main';
}

/** Parse the `tracks` URL/query param ("india,africa") into known optional tracks, in canonical order. */
export function parseTracks(value: string | null | undefined): Track[] {
    const wanted = new Set((value || '').split(',').map((s) => s.trim().toLowerCase()));
    return OPTIONAL_TRACKS.filter((t) => wanted.has(t.key)).map((t) => t.key);
}

/** True when the winner is in the main track or one of the opted-in tracks. */
export function inTracks(winner: Pick<Winner, 'batch'>, tracks: Track[]): boolean {
    const track = trackOf(winner.batch);
    return track === 'main' || tracks.includes(track);
}
