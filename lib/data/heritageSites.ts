/**
 * Single source of truth for the three heritage sites featured on the
 * showcase. Content lives here (decoupled from markup) so the Heritage
 * Grid, individual site pages, and search/filtering features can all be
 * built from the same data without touching component code — satisfies
 * the "maintainable / modular & decoupled" project requirement.
 */
export type HeritageSite = {
  slug: string;
  name: string;
  location: string;
  category: string;
  image: string;
  excerpt: string;
  ctaLabel: string;
};

export const heritageSites: HeritageSite[] = [
  {
    slug: "hundred-islands",
    name: "Hundred Islands",
    location: "Alaminos City",
    category: "Adventure",
    image: "/images/card1.jpg",
    excerpt:
      "124 limestone islets scattered across Lingayen Gulf — island-hop, kayak, and snorkel a national landmark.",
    ctaLabel: "Explore the Islands",
  },
  {
    slug: "bolinao-lighthouse",
    name: "Bolinao Lighthouse",
    location: "Bolinao",
    category: "Heritage",
    image: "/images/card2.jpg",
    excerpt:
      "One of the oldest Spanish-era lighthouses in the country, still guiding ships from a cliff over the West Philippine Sea.",
    ctaLabel: "Visit the Lighthouse",
  },
  {
    slug: "balungao-hotspring",
    name: "Balungao Hot Spring",
    location: "Balungao",
    category: "Relaxation",
    image: "/images/card3.jpg",
    excerpt:
      "Mineral-rich spring pools tucked into the foothills of Mount Balungao — a quiet retreat after island-hopping.",
    ctaLabel: "Unwind at the Spring",
  },
];
