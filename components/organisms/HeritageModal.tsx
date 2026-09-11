"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Eyebrow, Heading, Body } from "../atoms/Typography";
import Icon from "../atoms/Icon";
import Button from "../atoms/Button";
import type { HeritageSite } from "../../lib/data/heritageSites";

interface HeritageModalProps {
  /** The site to show large, or null when the modal should be closed.
   *  Kept controlled by the parent (HeritageGrid) rather than owning
   *  its own "which site" state, so only one thing in the app ever
   *  decides which card is currently enlarged. */
  site: HeritageSite | null;
  onClose: () => void;
}

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Heritage Modal (organism)
 * ---------------------------------------------------------------
 * Usage context: opened from HeritageGrid when a HeritageCard's photo
 * or CTA is activated — "make the card big when it's clicked" without
 * building a separate route for each site. Shows the same photo at a
 * much larger size plus the full site description and a follow-up CTA.
 *
 * Responsive logic:
 *   - The dialog is a centered panel capped at `max-w-2xl` with side
 *     margin (`p-4` on the backdrop) so it never touches the viewport
 *     edge, even on the smallest phones.
 *   - The photo always spans the full width of the panel and stays the
 *     dominant element — `h-72` on mobile, growing to `h-96` from `sm`
 *     (640px) up — with the text below it, rather than being squeezed
 *     into a narrow side column; the point of "making it bigger" is
 *     defeated if the enlarged image is smaller than the panel itself.
 *   - `max-h-[90vh]` + `overflow-y-auto` on the panel means a long
 *     description never pushes the close button off-screen on short
 *     viewports (landscape phones, small laptops) — it scrolls inside
 *     the panel instead.
 *
 * Motion: the panel scales/fades in from 95% → 100% opacity over
 * 200ms (and reverses on close) instead of snapping open, so "the card
 * gets big" reads as a single continuous motion rather than a jump cut.
 * Respects `prefers-reduced-motion` by skipping the scale/opacity
 * transition entirely for anyone who has that OS setting on.
 *
 * Accessibility: `role="dialog"` + `aria-modal` + `aria-labelledby`
 * pointing at the site name; Escape closes it, so does a click on the
 * backdrop; Tab/Shift+Tab are trapped inside the dialog while it's
 * open; the close button receives focus as soon as the modal opens,
 * and focus returns to whatever triggered it on close; body scroll is
 * locked while it's open so background content can't scroll underneath.
 */
export default function HeritageModal({ site, onClose }: HeritageModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<Element | null>(null);

  // Keeps rendering the last-open site while the exit transition plays,
  // even after the parent has already set `site` back to null.
  const [displaySite, setDisplaySite] = useState<HeritageSite | null>(null);
  const [entered, setEntered] = useState(false);

  // Step 1: as soon as `site` is set, mirror it into `displaySite` so
  // the panel renders and mounts into the DOM.
  useEffect(() => {
    if (site) setDisplaySite(site);
  }, [site]);

  // Step 2: everything that needs the panel to actually exist in the
  // DOM (focusing the close button, trapping Tab, locking scroll) is
  // keyed off `displaySite` too, not just `site` — otherwise this runs
  // one render too early, before Step 1's state update has committed,
  // and `closeButtonRef.current` is still null.
  useEffect(() => {
    if (!site || !displaySite) return;

    const raf = requestAnimationFrame(() => setEntered(true));

    triggerRef.current = document.activeElement;
    closeButtonRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [site, displaySite, onClose]);

  // Step 3: on close, start the exit transition immediately and return
  // focus to whatever opened the modal (the card's photo/CTA button).
  useEffect(() => {
    if (site) return;
    setEntered(false);
    if (triggerRef.current instanceof HTMLElement) triggerRef.current.focus();
  }, [site]);

  if (!displaySite) return null;

  return (
    <div
      aria-hidden={!site}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-ink/70 p-4 transition-opacity duration-200 motion-reduce:transition-none ${
        entered ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="heritage-modal-title"
        onClick={(e) => e.stopPropagation()}
        className={`relative flex w-full max-w-2xl flex-col overflow-y-auto rounded-2xl bg-sand shadow-2xl transition-[transform,opacity] duration-200 motion-reduce:transition-none max-h-[90vh] ${
          entered ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-ink/60 text-sand transition-colors hover:bg-ink focus-visible:outline-2 focus-visible:outline-clay"
        >
          <Icon name="close" className="h-4 w-4" />
        </button>

        <div className="relative h-72 w-full shrink-0 sm:h-96">
          <Image
            src={displaySite.image}
            alt={`${displaySite.name}, ${displaySite.location}`}
            fill
            sizes="(min-width: 640px) 42rem, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-1 flex-col items-start gap-3 p-6 sm:p-8">
          <Eyebrow>{displaySite.category}</Eyebrow>
          <Heading level={2} id="heritage-modal-title" className="text-2xl sm:text-3xl">
            {displaySite.name}
          </Heading>
          <p className="flex items-center gap-1 text-sm text-moss">
            <Icon name="map-pin" className="h-3.5 w-3.5" />
            {displaySite.location}
          </p>
          <Body muted className="mt-1">
            {displaySite.excerpt}
          </Body>

          <Button href="#footer" variant="outline-dark" className="mt-4" onClick={onClose}>
            Plan a Visit
          </Button>
        </div>
      </div>
    </div>
  );
}
