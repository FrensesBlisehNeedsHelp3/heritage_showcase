import HeritageImage from "../atoms/HeritageImage";
import Icon from "../atoms/Icon";
import { Eyebrow, Heading } from "../atoms/Typography";
import Button from "../atoms/Button";
import type { HeritageSite } from "../../lib/data/heritageSites";

interface HeritageCardProps {
  site: HeritageSite;
  priority?: boolean;
  /** Called with this card's site when the card (image or CTA) is
   *  activated — the parent organism decides what that means (here:
   *  open the enlarged Heritage Modal). */
  onOpen: (site: HeritageSite) => void;
  /** DOM id for this card's root element — matches `site.slug` so
   *  external links (Footer's per-site quick links) have a real,
   *  working in-page anchor to jump to, e.g. `#hundred-islands`. */
  id?: string;
}

/**
 * HeritageCard (molecule)
 * ---------------------------------------------------------------
 * Usage context: used exclusively for displaying a heritage-site preview
 * inside the responsive Heritage Grid (see organisms/HeritageGrid.tsx).
 * Not intended as a general-purpose card — a different molecule should
 * be built for, e.g., an itinerary or event card.
 *
 * Responsive logic: the card itself has no internal breakpoints — it is
 * a single-column composition (image → label → heading → excerpt →
 * button) that simply stretches to fill whatever grid cell the parent
 * organism gives it. That's deliberate: all the responsive decisions
 * (1 col on mobile → 3 cols on desktop) live in one place, the grid.
 *
 * Interaction: the photo is a big tap target that opens the enlarged
 * Heritage Modal (see organisms/HeritageModal.tsx) for this site — a
 * quick "make it bigger" preview that doesn't require a dedicated page.
 * A darkening scrim + expand icon + "View Larger" label fade in on
 * hover/focus so the photo visibly announces itself as clickable
 * before anyone clicks it (mobile just shows it always-tappable, no
 * hover needed there). The CTA button underneath does the same thing,
 * so keyboard/tap users get an unambiguous, clearly-labelled way in as
 * well as the photo.
 *
 * The card deliberately does NOT show the site's excerpt (unlike the
 * modal, which does) — Heritage Grid is pinned to exactly one screen
 * with no scrolling, so the grid view stays to image + label + button
 * only; the full description is one click away in the modal.
 *
 * Props:
 *   site      one entry from lib/data/heritageSites.ts
 *   priority  pass true only for the first card above the fold, to hint
 *             next/image to preload it (LCP)
 *   onOpen    fires with `site` when the card should open large
 *   id        DOM id (see HeritageCardProps) for external deep-links
 */
export default function HeritageCard({ site, priority = false, onOpen, id }: HeritageCardProps) {
  return (
    <article id={id} className="group flex scroll-mt-24 flex-col">
      <button
        type="button"
        onClick={() => onOpen(site)}
        aria-label={`View ${site.name} larger`}
        className="relative aspect-square w-full overflow-hidden rounded-2xl bg-moss/20 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-clay"
      >
        <HeritageImage
          src={site.image}
          alt={`${site.name}, ${site.location}`}
          priority={priority}
          className="transition-transform duration-500 group-hover:scale-105"
        />

        {/* Hover/focus-only affordance — signals "clickable" before the click */}
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center gap-2 bg-ink/0 text-sand opacity-0 transition-all duration-300 group-hover:bg-ink/40 group-hover:opacity-100 group-focus-within:bg-ink/40 group-focus-within:opacity-100"
        >
          <span className="flex items-center gap-2 rounded-full border border-sand/70 bg-ink/40 px-4 py-2 text-xs font-semibold uppercase tracking-widest2 backdrop-blur-sm">
            <Icon name="expand" className="h-3.5 w-3.5" />
            View Larger
          </span>
        </div>
      </button>

      <div className="mt-3 flex flex-1 flex-col items-start gap-1 text-left">
        <Eyebrow>{site.category}</Eyebrow>
        <Heading level={3}>{site.name}</Heading>

        <p className="flex items-center gap-1 text-sm text-moss">
          <Icon name="map-pin" className="h-3.5 w-3.5" />
          {site.location}
        </p>

        <Button
          variant="outline-dark"
          className="mt-2.5"
          onClick={() => onOpen(site)}
        >
          {site.ctaLabel}
        </Button>
      </div>
    </article>
  );
}
