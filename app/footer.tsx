export default function Footer() {
    return (
        <>
            <p class="mb-4">Project by <a className="underline" href="https://nabeelqu.co">Nabeel S. Qureshi</a>; design inspired by <a className="underline" href="https://thesephist.com">Linus Lee's</a> project, <a className="underline" href="https://ycvibecheck.com/">YC Vibe Check</a>.</p>
            <p class="mb-4">Written in <a className="underline" href="https://nextjs.org/">next.js</a>, with semantic search thanks to <a className="underline" href="https://huggingface.co/docs/transformers.js/index">transformers.js</a> and <a className="underline" href="https://www.sbert.net/">sentence-transformers</a> using the <a className="underline" href="https://huggingface.co/sentence-transformers/all-mpnet-base-v2">all-mpnet-base-v2</a> model, based on a model by Microsoft.</p>
            <p class="mb-4">Data sourced by Nabeel from <a className="underline" href="https://marginalrevolution.com">Marginal Revolution</a>.</p>
            <p class="mb-4"><a className="underline" href="https://www.mercatus.org/emergent-ventures">Emergent Ventures</a> lives at the Mercatus Center and was founded by <a className="underline" href="https://en.wikipedia.org/wiki/Tyler_Cowen">Tyler Cowen</a>.</p>
            <p class="mb-4">Last updated December 2023, up to cohort #30. Submit an update to the <a className="underline" href="https://github.com/nqureshi/ev-winners">Github repo</a>.</p>
        </>
    )
}