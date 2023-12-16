function calcVectorSize(vec: number[]): number {
    // Implementation of calcVectorSize (if you haven't defined it yet)
    return Math.sqrt(vec.reduce((acc, val) => acc + val * val, 0));
}

export function cosSim(vec1: number[], vec2: number[]): number {
    const dotProduct = vec1.map((val, i) => val * vec2[i]).reduce((accum, curr) => accum + curr, 0);
    const vec1Size = calcVectorSize(vec1);
    const vec2Size = calcVectorSize(vec2);

    if (vec1Size === 0 || vec2Size === 0) {
        return 0; // Handle division by zero if one of the vectors is zero
    }

    return dotProduct / (vec1Size * vec2Size);
}
