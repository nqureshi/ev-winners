import { promises as fs } from 'fs';
import path from 'path';
import { Winner } from '../types';

let cache: Promise<Winner[]> | null = null;

/** Full dataset, embeddings included. Server-only; cached per process. */
export function loadWinners(): Promise<Winner[]> {
    if (!cache) {
        cache = fs
            .readFile(path.resolve(process.cwd() + '/app/data/ev-winners-with-embeddings.json'), 'utf8')
            .then((file) => JSON.parse(file) as Winner[]);
    }
    return cache;
}

/** Strip the embedding vectors so the payload sent to the browser stays small. */
export function stripEmbeddings(winners: Winner[]): Winner[] {
    return winners.map(({ embedding_description, ...rest }) => rest as Winner);
}
