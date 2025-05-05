import { type NextRequest, NextResponse } from 'next/server'
import { pipeline } from '@xenova/transformers';

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

async function getSentiment(query: string) {
    const extractor = await getExtractor();
    const startTime = performance.now();
    let output = await extractor(query, { pooling: 'mean', normalize: true });
    const endTime = performance.now();
    console.log(`Query processing took ${Math.round(endTime - startTime)}ms`);
    return Array.from(output.data);
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    console.log(`Received query: "${query}"`);
    const startTime = performance.now();
    const sentiment = await getSentiment(query)
    const endTime = performance.now();
    console.log(`Total request processed in ${Math.round(endTime - startTime)}ms`);
    return NextResponse.json({ query: query, message: sentiment }, { status: 200 });
}