"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import NavItem from "../molecules/NavItem";
import Icon from "../atoms/Icon";
import SearchForm from "../molecules/SearchForm";

interface NavLink {
  href: string;
  label: string;
}

interface HeaderProps {
  /** Current search text and its setter, lifted all the way up to
   *  app/page.tsx (Header has no ancestor in common with Heritage Grid,
   *  the section that renders the filtered results, other than the
   *  page itself). Header owns the Search Form molecule — rendered
   *  inline in the desktop nav row, and again at the top of the mobile
   *  menu panel — so it's reachable from every screen via the fixed
   *  nav, not just screen 1. */
  query: string;
  onQueryChange: (value: string) => void;
}

const LINKS: NavLink[] = [
  { href: "#top", label: "Home" },
  { href: "#heritage-sites", label: "Heritage Sites" },
  { href: "#about", label: "About the Province" },
  { href: "#footer", label: "Plan a Visit" },
];

/**
 * Header Navigation (organism)
 * ---------------------------------------------------------------
 * Usage context: the site's single global navigation bar, rendered once
 * inside Hero (organisms/Hero.tsx) but positioned `fixed`, so it stays
 * reachable from every section, not just the hero it visually starts
 * over. Becomes an opaque bar the instant the mobile menu opens so its
 * links stay readable over any background.
 *
 * Responsive logic:
 *   < 768px (mobile)  — brand + hamburger button only. Tapping the
 *                       hamburger drops down a full-width, opaque ink
 *                       panel listing the same links stacked vertically.
 *   ≥ 768px (desktop) — brand + inline nav links + a "Plan a Visit"
 *                       link, all in a single row; hamburger is hidden.
 * Breakpoint: Tailwind's `md` (768px) — chosen because four nav labels
 * plus a logo reliably wrap on narrower phones-in-landscape / small
 * tablets if shown inline any earlier.
 *
 * LINKS starts with an explicit "Home" entry (`#top`, the Hero) so the
 * nav reads as starting from screen 1 — not just the wordmark-as-home
 * convention, which isn't always obvious as a nav affordance on its own.
 *
 * Scroll behavior: starts transparent with light text so it reads
 * cleanly over the hero photo, then — once the page is scrolled more
 * than a few pixels — crossfades to a solid, blurred sand bar with dark
 * text and a soft shadow, since every section after the hero has a
 * light background. An IntersectionObserver also watches each nav
 * target section and underlines whichever one is currently in view, so
 * the nav doubles as a "you are here" indicator on a single long page.
 * Because the footer section is short, it may never fill the
 * observer's trigger band on its own — a scroll-position fallback
 * force-activates the last link once the page is scrolled to the
 * bottom, so "Plan a Visit" reliably lights up there.
 *
 * Search: sits inside the desktop nav row (grouped with the links, at
 * the end) capped at a compact `w-44 lg:w-56` — full-width like on a
 * dedicated search screen would dwarf the nav links next to it. On
 * mobile the collapsed bar has no room for it, so it reappears full
 * width at the top of the hamburger's dropdown panel instead. Its
 * `bg-sand` pill is opaque regardless of the header's own
 * transparent/scrolled state, so it stays legible either way without
 * needing the nav links' separate `light` theming.
 */
export default function Header({ query, onQueryChange }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState<string | null>(null);

  useEffect(() => {
    const lastHref = LINKS[LINKS.length - 1].href;

    const handleScroll = () => {
      setScrolled(window.scrollY > 8);

      // The last section (footer) is often too short for the
      // IntersectionObserver's trigger band below to ever reach it — the
      // page simply can't scroll far enough for a short section to cross
      // a band anchored well above the very bottom. So once the user has
      // reached (or nearly reached) the bottom of the page, force the
      // last nav link active as a guaranteed fallback, overriding
      // whatever the observer last reported.
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) setActiveHref(lastHref);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = LINKS.map((link) => document.getElementById(link.href.slice(1))).filter(
      (el): el is HTMLElement => el !== null
    );
    if (sections.length === 0) return;

    // Standard "scrollspy" band: a section becomes active once its top
    // has crossed into the upper third of the viewport and before it
    // scrolls past the lower third — rather than requiring it to occupy
    // the exact vertical center, which a short section (like the footer)
    // may never do.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveHref(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: 0 }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const light = !scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-sand/90 shadow-sm backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-6 sm:px-10">
        <Link
          href="#top"
          className={`font-display text-lg font-semibold uppercase tracking-widest2 transition-colors duration-300 ${
            light ? "text-sand" : "text-ink"
          }`}
        >
          Pangasinan
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <NavItem
              key={link.href}
              href={link.href}
              light={light}
              active={activeHref === link.href}
            >
              {link.label}
            </NavItem>
          ))}
          <div className="w-44 lg:w-56">
            <SearchForm
              id="heritage-search-desktop"
              value={query}
              onChange={onQueryChange}
            />
          </div>
        </nav>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className={`transition-colors duration-300 md:hidden ${light ? "text-sand" : "text-ink"}`}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? "close" : "menu"} className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <nav id="mobile-menu" aria-label="Primary" className="mx-4 mb-4 rounded-2xl bg-ink px-6 py-6 md:hidden">
          <SearchForm
            id="heritage-search-mobile"
            value={query}
            onChange={onQueryChange}
            className="mb-5"
          />
          <ul className="flex flex-col gap-5">
            {LINKS.map((link) => (
              <li key={link.href}>
                <NavItem
                  href={link.href}
                  onClick={() => setOpen(false)}
                  active={activeHref === link.href}
                >
                  {link.label}
                </NavItem>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
