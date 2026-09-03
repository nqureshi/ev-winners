import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

const NAV = [
  { label: "About", href: "#about", external: false },
  { label: "GitHub", href: "https://github.com/nqureshi/ev-winners", external: true },
  { label: "Data", href: "https://github.com/nqureshi/ev-search-python/blob/main/data/ev-winners.csv", external: true },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-paper-line/80 bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/" className="group flex min-w-0 items-center gap-2 text-sm font-semibold tracking-tight text-ink sm:gap-2.5 sm:text-[15px]">
          <span
            aria-hidden="true"
            className="inline-block h-3 w-3 shrink-0 rounded-[3px] bg-mr-500 shadow-[0_0_0_3px_rgba(0,199,159,0.18)] transition-transform group-hover:rotate-45"
          />
          <span className="whitespace-nowrap">
            <span className="min-[360px]:hidden">EV</span>
            <span className="hidden min-[360px]:inline">Emergent Ventures</span>{' '}
            <span className="font-normal text-ink-muted min-[360px]:hidden sm:inline">Winners</span>
          </span>
        </Link>
        <nav className="flex shrink-0 items-center gap-0.5 sm:gap-2" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className="group inline-flex items-center gap-0.5 rounded-md px-1.5 py-1.5 sm:px-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-paper-soft hover:text-ink"
            >
              {item.label}
              {item.external && (
                <ArrowUpRight className="hidden h-3.5 w-3.5 text-ink-faint sm:block transition-colors group-hover:text-mr-600" aria-hidden="true" />
              )}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
