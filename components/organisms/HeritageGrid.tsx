"use client";

import { useMemo, useState } from "react";
import { Eyebrow, Heading, Body } from "../atoms/Typography";
import HeritageCard from "../molecules/HeritageCard";
import HeritageModal from "./HeritageModal";
import { heritageSites, type HeritageSite } from "../../lib/data/heritageSites";

interface HeritageGridProps {
  /**
   * Current search text. The Search Form itself lives in Hero (screen
   * 1) so visitors can start filtering the moment they land — the
   * `query` state it writes to is owned one level up, in app/page.tsx,
   * and handed down here as a prop. This organism still owns the
   * *filtering logic* (what "search" means for this data: name / town
   * / category), just not the input that drives it.
   */
  query: string;
}

/**
 * Heritage Grid (organism) — Screen 2 of 3
 * ---------------------------------------------------------------
 * Usage context: the province's three flagship destinations, presented
 * as an equal-weight trio right after the hero's call-to-action lands
 * here (`#heritage-sites`). Renders whatever `query` (typed into the
 * Search Form up in Hero) filters down to; owns the filtering logic
 * itself — the grid decides what "search" means for this data (name /
 * town / category).
 *
 * Responsive logic:
 *   - Content is driven entirely by lib/data/heritageSites.ts: adding a
 *     4th site is a data change, not a markup change — this is the
 *     "modular / decoupled" requirement in practice.
 *   - The section is pinned to `min-h-[100svh]` — one full screen on
 *     typical viewports, matching Hero and About. To make the heading
 *     and all 3 cards fit in that one screen: cards use compact square
 *     photos (HeritageCard drops its excerpt paragraph entirely — the
 *     full description lives one click away in the modal) and every
 *     gap between heading/grid is kept tight. `min-h` (not a hard
 *     `h-`) is deliberate: on a short, non-maximized window the content
 *     won't all fit in one screen, and a hard height + centered flex
 *     would clip the cards' CTA buttons top-and-bottom, reading as
 *     overlap with the About section below — `min-h` lets the section
 *     grow instead. The content column is capped at `max-w-5xl` (not
 *     the page's usual, wider `max-w-content`) — narrow enough to leave
 *     headroom for the photos to stay a decent size without the row
 *     going edge-to-edge, but wide enough that they read as real
 *     photos, not thumbnails.
 *   - Below 640px, three cards stacked full-width would each need a
 *     full-width square photo — taller than most phone screens on
 *     their own, let alone all three stacked. So under 640px the row
 *     becomes a horizontal snap-scroll carousel (one card at a time,
 *     swipe for the next) instead of a vertical stack: the *section*
 *     still never scrolls vertically, only the card row scrolls
 *     sideways. From 640px (tablet) up there's enough width for a real
 *     2-column, then 3-column (≥1024px) grid instead.
 *   - Only the first *unfiltered* card gets `priority` on its image —
 *     it's the one most likely to sit just below the fold on first
 *     paint; once a search is active, priority no longer matters since
 *     the image is already in the loaded page.
 *
 * Also owns which site (if any) is shown "big" — clicking a card's
 * photo or CTA sets `openSite`, which HeritageModal renders enlarged;
 * only one card can be open at a time by construction.
 */
export default function HeritageGrid({ query }: HeritageGridProps) {
  const [openSite, setOpenSite] = useState<HeritageSite | null>(null);

  const filteredSites = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return heritageSites;
    return heritageSites.filter((site) =>
      [site.name, site.location, site.category].some((field) =>
        field.toLowerCase().includes(q)
      )
    );
  }, [query]);

  return (
    <section id="heritage-sites" className="flex min-h-[100svh] flex-col justify-center overflow-hidden bg-sage py-16">
      <div className="mx-auto w-full max-w-5xl px-6 sm:px-10">
        <div className="mx-auto max-w-xl text-center">
          <Eyebrow className="justify-center">Licence to Explore</Eyebrow>
          <Heading level={2} className="mt-2">
            Three Sites, One Province
          </Heading>
        </div>

        {filteredSites.length > 0 ? (
          <div className="mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-1 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:pb-0 lg:grid-cols-3 lg:gap-8">
            {filteredSites.map((site, index) => (
              <div key={site.slug} className="w-[78%] shrink-0 snap-center sm:w-auto sm:shrink sm:snap-none">
                <HeritageCard
                  id={site.slug}
                  site={site}
                  priority={!query && index === 0}
                  onOpen={setOpenSite}
                />
              </div>
            ))}
          </div>
        ) : (
          <Body muted className="mt-8 text-center">
            No heritage site matches &ldquo;{query}&rdquo;. Try
            &ldquo;islands&rdquo;, &ldquo;lighthouse&rdquo;, or
            &ldquo;spring&rdquo;.
          </Body>
        )}
      </div>

      <HeritageModal site={openSite} onClose={() => setOpenSite(null)} />
    </section>
  );
}
