import { type NextRequest, NextResponse } from 'next/server'
import { pipeline } from '@xenova/transformers';
import { loadWinners, stripEmbeddings } from '@/app/lib/winners';
import { getSortedData } from '@/app/utils/getSortedData';

// Model singleton to prevent reloading on each request
let modelCache: any = null;

// Get or initialize the model
async function getExtractor() {
  if (!modelCache) {
    console.log('Initializing model for the first time...');
    modelCache = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return modelCache;
}

async function embed(query: string): Promise<number[]> {
    const extractor = await getExtractor();
    const startTime = performance.now();
    const output = await extractor(query, { pooling: 'mean', normalize: true });
    const endTime = performance.now();
    console.log(`Query embedding took ${Math.round(endTime - startTime)}ms`);
    return Array.from(output.data) as number[];
}

/**
 * Embeds the query, ranks every winner by cosine similarity, and returns the
 * top matches (without their embedding vectors) so the client never has to
 * download the full embedding set.
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const query = (searchParams.get('query') || '').trim()
    if (!query) {
        return NextResponse.json({ query, results: [] }, { status: 200 });
    }
    console.log(`Received query: "${query}"`);
    const startTime = performance.now();
    const [queryEmbedding, winners] = await Promise.all([embed(query), loadWinners()]);
    const results = stripEmbeddings(getSortedData(winners, queryEmbedding));
    const endTime = performance.now();
    console.log(`Total request processed in ${Math.round(endTime - startTime)}ms`);
    return NextResponse.json({ query, results }, { status: 200 });
}
