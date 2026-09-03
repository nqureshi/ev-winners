import { Winner } from '../types'
import { cosSim } from './cosSim';

export const TOP_N = 20;

/** Rank winners by cosine similarity to the query embedding and return the top N. */
export function getSortedData(data: Winner[], queryEmbedding: number[]): Winner[] {
    const dataWithSimilarity = data
        .filter((winner) => Array.isArray(winner.embedding_description) && winner.embedding_description.length > 0)
        .map((winner) => ({
            ...winner,
            similarity: cosSim(winner.embedding_description, queryEmbedding),
        }));

    dataWithSimilarity.sort((a, b) => b.similarity - a.similarity);

    return dataWithSimilarity.slice(0, TOP_N);
}
