import Icon from "../atoms/Icon";

interface SearchFormProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  /** Element id for the input (and its label's `htmlFor`). Must be
   *  overridden whenever more than one instance can be mounted at once
   *  — e.g. Header renders one copy in the desktop nav and another in
   *  the mobile menu panel; responsive classes only hide one visually,
   *  both stay in the DOM, so a shared id would duplicate it. */
  id?: string;
}

/**
 * Search Form (molecule)
 * ---------------------------------------------------------------
 * Usage context: rendered in Header (see organisms/Header.tsx) — once
 * inline in the desktop nav row, again at the top of the mobile menu
 * panel (each with its own `id`, since both stay mounted in the DOM
 * at once and only CSS decides which is visible) — so it's reachable
 * from every screen via the fixed nav, not just screen 1. The results
 * render in Heritage Grid (organisms/HeritageGrid.tsx, screen 2)
 * against the same query, which Header's and Heritage Grid's shared
 * ancestor (app/page.tsx) owns and passes down to both. Filters the
 * three featured sites by name, category ("Adventure"/"Heritage"/
 * "Relaxation"), or town. A controlled component on purpose — it owns
 * no state of its own, so whichever parent renders it decides what
 * "search" means for its data and can reuse this exact molecule
 * anywhere else a filter box is needed (e.g. a future "All
 * Destinations" page) without any changes here.
 *
 * Responsive logic: a single full-width input at every breakpoint —
 * search boxes don't need a layout change between mobile and desktop,
 * only a comfortable tap target (h-12) so it stays easy to hit on a
 * touchscreen.
 *
 * Accessibility: the visible placeholder is not the only label — an
 * sr-only <label> is tied to the input via htmlFor/id so screen readers
 * announce its purpose, and role="search" marks the landmark.
 */
export default function SearchForm({
  value,
  onChange,
  placeholder = "Search by site, town, or category…",
  label = "Search heritage sites",
  className = "",
  id = "heritage-search",
}: SearchFormProps) {
  return (
    <form
      role="search"
      onSubmit={(e) => e.preventDefault()}
      className={`relative w-full ${className}`}
    >
      <label htmlFor={id} className="sr-only">
        {label}
      </label>

      <Icon
        name="search"
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-moss"
      />

      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-full border border-ink/15 bg-sand pl-11 pr-4 text-sm text-ink placeholder:text-moss/70 focus-visible:outline-2 focus-visible:outline-clay"
      />
    </form>
  );
}
