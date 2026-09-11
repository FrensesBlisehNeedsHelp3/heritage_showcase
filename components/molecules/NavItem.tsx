import Link from "next/link";
import type { ReactNode, MouseEventHandler } from "react";

interface NavItemProps {
  href: string;
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  className?: string;
  /** Color scheme for the link: `true` (default) for use over a dark/
   *  photo background (the hero), `false` for use over the solid,
   *  light header bar shown once the page is scrolled. */
  light?: boolean;
  /** Marks this link as matching the section currently in view —
   *  underlines it and sets aria-current="page" for assistive tech. */
  active?: boolean;
}

/**
 * NavItem (molecule)
 * ---------------------------------------------------------------
 * Usage context: used exclusively inside Header Navigation
 * (organisms/Header.tsx), both in the desktop inline nav and the
 * mobile slide-down menu — the same component, just laid out
 * differently by its parent.
 *
 * Responsive logic: the link itself doesn't change; Header decides
 * whether it renders in a horizontal row (desktop, ≥768px) or a
 * stacked full-width list (mobile menu panel).
 */
export default function NavItem({
  href,
  children,
  onClick,
  className = "",
  light = true,
  active = false,
}: NavItemProps) {
  const tone = light
    ? "text-sand/90 hover:text-sand"
    : "text-ink/70 hover:text-ink";
  const activeTone = active
    ? `underline decoration-2 underline-offset-4 ${light ? "text-sand" : "text-ink"}`
    : "";

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`text-xs font-medium uppercase tracking-widest2 transition-colors ${tone} ${activeTone} ${className}`}
    >
      {children}
    </Link>
  );
}
