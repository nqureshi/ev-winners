import { Winner } from '../columns'
import { cosSim } from './cosSim';

export function getSortedData(data: Winner[], queryEmbedding: number[]): Winner[] {
    // Calculate cosine similarity for each winner and store it along with the winner
    const dataWithSimilarity = data.map(winner => ({
        ...winner,
        similarity: cosSim(winner.embedding_description, queryEmbedding)
    }));

    // Sort the data based on similarity scores
    dataWithSimilarity.sort((a, b) => b.similarity - a.similarity);

    // Return the top 20 entries
    return dataWithSimilarity.slice(0, 20);
}