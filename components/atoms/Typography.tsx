import type { ReactNode } from "react";

/**
 * Typography (atom)
 * ---------------------------------------------------------------
 * Three primitives cover every text style in the showcase:
 *   <Eyebrow>          small tracked-out uppercase label
 *   <Heading level={1|2|3} light>  serif display heading
 *   <Body muted>        sans body copy
 *
 * Centralising type here means a font-size/tracking change is a one-file
 * edit instead of a find-and-replace across every section.
 */

interface EyebrowProps {
  children: ReactNode;
  light?: boolean;
  className?: string;
}

export function Eyebrow({ children, light = false, className = "" }: EyebrowProps) {
  return (
    <p
      className={`text-sm font-medium uppercase tracking-widest2 ${
        light ? "text-sand/80" : "text-moss"
      } ${className}`}
    >
      {children}
    </p>
  );
}

interface HeadingProps {
  level?: 1 | 2 | 3;
  light?: boolean;
  className?: string;
  children: ReactNode;
  /** Lets a modal/section point aria-labelledby at this heading. */
  id?: string;
}

export function Heading({ level = 2, light = false, className = "", children, id }: HeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  // Fraunces reads best with weight scaled to size: the hero <h1> can
  // carry a near-black 900 without going illegible since it's set so
  // large, while smaller card/modal headings (level 3) stay at a
  // lighter 600 so dense grids of them don't feel heavy-handed.
  const sizes: Record<1 | 2 | 3, string> = {
    1: "text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.03]",
    2: "text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1]",
    3: "text-xl sm:text-2xl font-semibold leading-tight",
  };
  return (
    <Tag
      id={id}
      className={`font-display ${sizes[level] ?? sizes[2]} ${
        light ? "text-sand" : "text-ink"
      } ${className}`}
    >
      {children}
    </Tag>
  );
}

interface BodyProps {
  children: ReactNode;
  muted?: boolean;
  light?: boolean;
  className?: string;
}

export function Body({ children, muted = false, light = false, className = "" }: BodyProps) {
  return (
    <p
      className={`font-body text-[15px] leading-normal ${
        light ? (muted ? "text-sand/70" : "text-sand/90") : muted ? "text-moss" : "text-ink/80"
      } ${className}`}
    >
      {children}
    </p>
  );
}
