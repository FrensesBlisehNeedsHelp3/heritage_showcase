/**
 * Icon (atom)
 * ---------------------------------------------------------------
 * Usage: <Icon name="arrow-right" className="h-4 w-4" />
 * A tiny inline-SVG set so the bundle never pays for an icon font or an
 * external icon package for four glyphs. Every path is decorative by
 * default (aria-hidden) — pair with visible or sr-only text for meaning.
 */
export type IconName =
  | "arrow-right"
  | "map-pin"
  | "menu"
  | "close"
  | "mail"
  | "phone"
  | "facebook"
  | "instagram"
  | "search"
  | "expand";

interface IconProps {
  name: IconName;
  className?: string;
}

const paths: Record<IconName, JSX.Element> = {
  "arrow-right": (
    <path
      d="M4 10h12m0 0-5-5m5 5-5 5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  "map-pin": (
    <path
      d="M10 18s6-5.2 6-9.8A6 6 0 0 0 4 8.2C4 12.8 10 18 10 18Zm0-7a2.2 2.2 0 1 0 0-4.4A2.2 2.2 0 0 0 10 11Z"
      fill="currentColor"
    />
  ),
  menu: (
    <path
      d="M3 6h14M3 10h14M3 14h14"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      fill="none"
    />
  ),
  close: (
    <path
      d="M5 5l10 10M15 5 5 15"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      fill="none"
    />
  ),
  mail: (
    <path
      d="M3 5.5h14v9H3v-9Zm0 0 7 5.5 7-5.5"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  phone: (
    <path
      d="M5 3.5c-.9 0-1.6.8-1.4 1.7.6 3 2.1 5.8 4.4 8.1 2.3 2.3 5.1 3.8 8.1 4.4.9.2 1.7-.5 1.7-1.4v-2a1 1 0 0 0-.8-1l-2.9-.6a1 1 0 0 0-1 .3l-1 1.1a11 11 0 0 1-4.6-4.6l1.1-1a1 1 0 0 0 .3-1L8.2 4.3a1 1 0 0 0-1-.8H5Z"
      fill="currentColor"
    />
  ),
  facebook: (
    <path
      d="M12.5 6.2H11c-.4 0-.7.3-.7.7v1.6h2.1l-.3 2.1h-1.8V17H8v-6.4H6.5V8.5H8V6.7C8 5 9.3 3.6 11 3.6h1.5v2.6Z"
      fill="currentColor"
    />
  ),
  instagram: (
    <>
      <rect x="3.3" y="3.3" width="13.4" height="13.4" rx="3.8" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <circle cx="10" cy="10" r="3.1" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <circle cx="13.7" cy="6.3" r="0.9" fill="currentColor" />
    </>
  ),
  search: (
    <>
      <circle cx="8.6" cy="8.6" r="4.6" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="m16 16-3.7-3.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  expand: (
    <path
      d="M7 3H3v4M13 3h4v4M3 13v4h4M17 13v4h-4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
};

export default function Icon({ name, className = "h-5 w-5" }: IconProps) {
  const path = paths[name];
  if (!path) return null;
  return (
    <svg
      viewBox="0 0 20 20"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {path}
    </svg>
  );
}
