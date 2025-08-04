export default function Footer() {
    return (
        <>
            <p className="mb-4">Project by <a className="underline" href="https://nabeelqu.co">Nabeel S. Qureshi</a>; design inspired by <a className="underline" href="https://thesephist.com">Linus Lee&lsquo;s</a> project, <a className="underline" href="https://ycvibecheck.com/">YC Vibe Check</a>.</p>
            <p className="mb-4">Written in <a className="underline" href="https://nextjs.org/">next.js</a>, with semantic search thanks to <a className="underline" href="https://huggingface.co/docs/transformers.js/index">transformers.js</a> and <a className="underline" href="https://www.sbert.net/">sentence-transformers</a>. The model is <a href="https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2" className="underline">all-MiniLM-L6-v2</a>.</p>
            <p className="mb-4">Data sourced by Nabeel from <a className="underline" href="https://marginalrevolution.com">Marginal Revolution</a> and starting from <a className="underline" href="https://newscience.org/emergent-ventures-winners/">Alexey Guzey&lsquo;s base.</a></p>
            <p className="mb-4"><a className="underline" href="https://www.mercatus.org/emergent-ventures">Emergent Ventures</a> lives at the Mercatus Center and was founded by <a className="underline" href="https://en.wikipedia.org/wiki/Tyler_Cowen">Tyler Cowen</a>. This is not an official website.</p>
            <p className="mb-4">Last updated August 4, 2025, up to cohort #44. Submit a data update to the <a className="underline" href="https://github.com/nqureshi/ev-search-python/tree/main/data">Github repo</a>.</p>
        </>
    )
}