"use client";

import Image from "next/image";
import { Eyebrow, Heading, Body } from "../atoms/Typography";
import Button from "../atoms/Button";
import Header from "./Header";

interface HeroProps {
  /** Current search text — lifted to app/page.tsx so it can also drive
   *  Heritage Grid's filtering below (screen 2). Hero doesn't render the
   *  search box itself; it just relays these two props down to Header,
   *  which owns the input (see Header.tsx). */
  query: string;
  onQueryChange: (value: string) => void;
}

/**
 * Hero (organism) — Screen 1 of 3
 * ---------------------------------------------------------------
 * Usage context: the first thing every visitor sees; owns the page's
 * <h1> and the primary call-to-action into the Heritage Grid below.
 * The search box lives in Header (rendered here, fixed on top of the
 * hero photo) rather than in Hero's own content, so it stays reachable
 * from every screen, not just this first one — see Header.tsx.
 *
 * Responsive logic:
 *   - Background photo uses next/image `fill` + `sizes="100vw"` so the
 *     browser fetches one correctly-sized file per viewport instead of
 *     a single oversized desktop image (this is the biggest win for the
 *     "lightning fast on 3G/4G" requirement, since the hero photo is
 *     normally the largest asset on the page). `priority` + `fetchPriority
 *     high` skip lazy-loading since this is always the Largest
 *     Contentful Paint element.
 *   - Section height is `min-h-[100svh]` (not a fixed px value) so it
 *     fills the viewport edge-to-edge — one screen — on any device
 *     without the old 100vh mobile Safari overflow bug, and content
 *     stays vertically centered via flex at every size. `min-` (not a
 *     hard `h-`) matters here: on a short, non-maximized browser
 *     window the content can be taller than the viewport, and a hard
 *     `h-[100svh]` + centered flex would clip it symmetrically top
 *     and bottom, reading as overlap with the neighbouring section.
 *     `min-h` lets the section grow past one screen instead.
 *   - Heading scales 4xl → 6xl → 7xl (mobile → tablet → desktop);
 *     the intro paragraph is width-capped (`max-w-sm`) so lines don't
 *     stretch unreadably wide on desktop.
 *   - The text block carries a `-mt-16` nudge upward off dead-center:
 *     `pt-20` on the same element exists only so the eyebrow clears the
 *     fixed Header, and centering that padded box would otherwise land
 *     the visible text noticeably below true center (padding at the
 *     top makes the box taller without a matching bottom addition, so
 *     flex centering pushes it down). The negative margin corrects for
 *     that without touching the header-clearance padding itself.
 */
export default function Hero({ query, onQueryChange }: HeroProps) {
  return (
    <section id="top" className="relative flex min-h-[100svh] items-center overflow-hidden bg-forest">
      <Image
        src="/images/hero-pangasinan.jpg"
        alt="Aerial view of the Hundred Islands, with the Christ the Redeemer statue on Governor's Island overlooking the limestone islets of Lingayen Gulf"
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="object-cover"
      />
      {/* Top scrim so the header stays legible even over a bright sky/cloud
          photo — independent of the bottom scrim below, since a photo can
          be light at the top and dark at the bottom (or vice versa). */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-ink/60 to-transparent"
      />
      {/* Bottom scrim so heading/copy stay legible over any photo */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent"
      />

      <Header query={query} onQueryChange={onQueryChange} />

      <div className="relative z-10 mx-auto -mt-16 w-full max-w-content px-6 pt-20 sm:px-10">
        <Eyebrow light className="mb-3">
          It&rsquo;s time to visit
        </Eyebrow>
        <Heading level={1} light className="max-w-2xl">
          Pangasinan
        </Heading>
        <Body light muted className="mt-5 max-w-sm">
          Crave hundred-island horizons, a centuries-old lighthouse, and
          mineral hot springs in the hills? Pangasinan holds all three —
          and the Provincial Tourism Office made sure you&rsquo;d never
          miss a stop.
        </Body>
        <div className="mt-7">
          <Button href="#heritage-sites">Our Heritage Sites</Button>
        </div>
      </div>
    </section>
  );
}
