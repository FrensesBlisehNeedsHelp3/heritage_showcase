import Link from "next/link";
import type { ReactNode } from "react";
import Icon from "./Icon";

export type ButtonVariant = "outline" | "outline-dark" | "solid";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: ButtonVariant;
  showArrow?: boolean;
  className?: string;
  /** Kept event-free so it works identically whether Button renders as
   *  a <Link> (anchor) or a <button> under the hood. */
  onClick?: () => void;
  /** Any other native <a>/<button> attribute (aria-*, target, etc). */
  [key: string]: unknown;
}

/**
 * Button (atom)
 * ---------------------------------------------------------------
 * Props:
 *   variant  "outline" (default, pill outline — used on photo/dark
 *            backgrounds) | "outline-dark" (pill outline for light
 *            backgrounds) | "solid" (filled ink pill — primary action)
 *   href     if present, renders as a Next.js <Link> (client-side nav);
 *            omit it to render a real <button type="button">
 *   showArrow  appends the arrow-right icon (default true)
 *
 * Usage:
 *   <Button href="#heritage-sites">Our Offers</Button>
 *   <Button variant="solid" onClick={...}>Learn More</Button>
 */
export default function Button({
  children,
  href,
  variant = "outline",
  showArrow = true,
  className = "",
  ...rest
}: ButtonProps) {
  const base =
    "inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-widest2 " +
    "transition-colors duration-200 focus-visible:outline-offset-4";

  const variants: Record<ButtonVariant, string> = {
    outline: "border border-sand/70 text-sand hover:bg-sand hover:text-ink",
    "outline-dark": "border border-ink/30 text-ink hover:bg-ink hover:text-sand",
    solid: "bg-ink text-sand hover:bg-moss",
  };

  const classes = `${base} ${variants[variant] ?? variants.outline} ${className}`;

  const content = (
    <>
      <span>{children}</span>
      {showArrow && <Icon name="arrow-right" className="h-3.5 w-3.5" />}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...rest}>
      {content}
    </button>
  );
}
