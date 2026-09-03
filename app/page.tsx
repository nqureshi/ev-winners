import { Suspense } from 'react'

import Header from './header'
import Container from './container'
import Footer from './footer'
import { ResultsSkeleton } from './winnersList'
import { loadWinners, stripEmbeddings } from './lib/winners'
import { compareCohorts } from './types'


export default async function Page() {
  const winners = await loadWinners()
  const data = stripEmbeddings(winners)

  const cohorts = Array.from(new Set(data.map((w) => w.batch))).sort(compareCohorts)
  const numericCohorts = cohorts.filter((c) => /^\d+$/.test(c)).map(Number)
  const latestCohort = Math.max(...numericCohorts)
  const latest = data.reduce((a, b) => (a.date_announced > b.date_announced ? a : b))
  const firstYear = data.reduce((a, b) => (a.date_announced < b.date_announced ? a : b)).date_announced.slice(0, 4)

  const stats = {
    winners: data.length,
    cohorts: latestCohort,
    firstYear,
    latestDate: latest.date_announced,
    latestLink: latest.link,
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<ResultsSkeleton />}>
          <Container data={data} stats={stats} />
        </Suspense>
      </main>
      <Footer stats={stats} />
    </div>
  )
}
