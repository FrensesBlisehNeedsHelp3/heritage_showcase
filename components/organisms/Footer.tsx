import Link from "next/link";
import Icon from "../atoms/Icon";
import { heritageSites } from "../../lib/data/heritageSites";

// Placeholder office contact details for the mockup — swap for the
// Provincial Tourism Office's real address/phone/email/socials before
// this ever goes live.
const CONTACT = {
  address: "Pangasinan Provincial Capitol, Lingayen, Pangasinan",
  email: "tourism@pangasinan.gov.ph",
  phone: "(075) 522-1234",
};

// No real social page URLs exist yet — swap `href` for the Provincial
// Tourism Office's actual Facebook/Instagram URLs before this goes
// live. Kept as real, keyboard-focusable, visibly-styled links (not
// removed or made inert) so they're easy to wire up later — but
// pointed at `#footer` (this section's own id) rather than a bare
// `href="#"`. A bare `#` jumps the whole page to the very top on
// click, which — with no real destination yet — reads as a broken
// "wrong screen" surprise; `#footer` is a harmless no-op scroll since
// clicking it happens right here at the footer already.
const SOCIALS: { name: "facebook" | "instagram"; href: string; label: string }[] = [
  { name: "facebook", href: "#footer", label: "Facebook" },
  { name: "instagram", href: "#footer", label: "Instagram" },
];

/**
 * Footer (organism)
 * ---------------------------------------------------------------
 * Usage context: closes out every page — site-wide utility content
 * (sitemap, contact, socials), not one of the three main "screens."
 * Kept as its own organism (rather than folded into AboutSection) so
 * it can later be reused unchanged on additional pages (a site detail
 * page, a contact page, etc).
 *
 * Responsive logic:
 *   - Main grid is 1 column on mobile (brand → links → contact stack,
 *     each full width and centered) and 3 columns from `sm` (640px) up,
 *     where there's room for all three side by side without cramming.
 *   - The bottom bar (copyright + socials) is `flex-col` on mobile,
 *     `flex-row` from `sm` up, same reasoning as the rest of the site:
 *     stacked centered content reads better than a squeezed row on a
 *     narrow phone.
 */
export default function Footer() {
  return (
    <footer id="footer" className="bg-ink pt-14 pb-8">
      <div className="mx-auto max-w-content px-6 sm:px-10">
        <div className="grid grid-cols-1 gap-10 text-center sm:grid-cols-3 sm:gap-8 sm:text-left">
          {/* Brand */}
          <div>
            <p className="font-display text-lg font-semibold uppercase tracking-widest2 text-sand">
              Pangasinan
            </p>
            <p className="mt-3 text-sm leading-normal text-sand/60">
              A digital heritage showcase by the Provincial Tourism
              Office — built to help travelers plan a trip around the
              province&rsquo;s islands, lighthouse, and hot springs.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest2 text-sand/40">
              Heritage Sites
            </p>
            <ul className="mt-4 flex flex-col items-center gap-3 sm:items-start">
              {heritageSites.map((site) => (
                <li key={site.slug}>
                  {/* All three sites live on the same screen (#heritage-sites)
                      — there's no dedicated per-site screen to jump to. Each
                      HeritageCard also carries a matching `id={site.slug}`
                      (see molecules/HeritageCard.tsx), but linking straight
                      to a nested card — rather than the section itself —
                      makes the browser's native anchor-scroll align to that
                      card's position (vertically centered in the section)
                      instead of the section's top edge, cutting off the
                      heading above it. Linking to the section keeps the
                      landing consistent with every other nav link: a clean,
                      full, un-cropped Screen 2. */}
                  <Link
                    href="#heritage-sites"
                    className="text-sm text-sand/80 transition-colors hover:text-sand"
                  >
                    {site.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest2 text-sand/40">
              Get in Touch
            </p>
            <ul className="mt-4 flex flex-col items-center gap-3 sm:items-start">
              <li className="flex items-center gap-2 text-sm text-sand/80">
                <Icon name="map-pin" className="h-4 w-4 shrink-0 text-sand/50" />
                <span>{CONTACT.address}</span>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="flex items-center gap-2 text-sm text-sand/80 transition-colors hover:text-sand"
                >
                  <Icon name="mail" className="h-4 w-4 shrink-0 text-sand/50" />
                  <span>{CONTACT.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT.phone.replace(/[^+\d]/g, "")}`}
                  className="flex items-center gap-2 text-sm text-sand/80 transition-colors hover:text-sand"
                >
                  <Icon name="phone" className="h-4 w-4 shrink-0 text-sand/50" />
                  <span>{CONTACT.phone}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-sand/10 pt-6" />

        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-xs uppercase tracking-widest2 text-sand/50">
            &copy; {new Date().getFullYear()} Pangasinan Provincial Tourism Office. All rights reserved.
          </p>

          <ul className="flex items-center gap-4">
            {SOCIALS.map((social) => (
              <li key={social.name}>
                <a
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-sand/20 text-sand/70 transition-colors hover:border-sand/50 hover:text-sand"
                >
                  <Icon name={social.name} className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
