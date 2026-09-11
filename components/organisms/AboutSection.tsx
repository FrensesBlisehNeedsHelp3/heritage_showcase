import Image from "next/image";
import { Eyebrow, Heading, Body } from "../atoms/Typography";
import Button from "../atoms/Button";

/**
 * About Section (organism) — Screen 3 of 3
 * ---------------------------------------------------------------
 * Usage context: closes the single-page showcase with the "why visit"
 * story from the Provincial Tourism Office and a final call-to-action,
 * mirroring the hero's invitation now that the visitor has seen all
 * three sites.
 *
 * Responsive logic:
 *   - Like Hero and Heritage Grid, the section is pinned to
 *     `min-h-[100svh]` and centered with flexbox — one full screen on
 *     typical viewports. `min-h` (not a hard `h-`) matters on a short,
 *     non-maximized window: it lets the section grow to fit its
 *     content instead of a hard height clipping it top-and-bottom,
 *     which would read as overlap with the Heritage Grid above.
 *   - `grid-cols-1 lg:grid-cols-2`: image and copy stack vertically on
 *     mobile/tablet (image first, full width, so it isn't squeezed) and
 *     sit side-by-side only from `lg` (1024px) up, where there's enough
 *     width for both without cramming either.
 *   - The image column uses a fixed aspect ratio (`aspect-[4/5]`)
 *     instead of a fixed height so it never distorts or overflows at
 *     any viewport width.
 *   - Copy column is left-aligned and width-capped on desktop
 *     (`max-w-md`) for a comfortable reading measure; on mobile it's
 *     simply full width under the image.
 */
export default function AboutSection() {
  return (
    <section id="about" className="flex min-h-[100svh] flex-col justify-center overflow-hidden bg-sand py-10 lg:py-0">
      <div className="mx-auto grid w-full max-w-content grid-cols-1 items-center gap-3 px-6 sm:gap-8 sm:px-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/5] max-h-[30svh] w-full overflow-hidden rounded-2xl sm:max-h-[46svh] lg:max-h-none">
          <Image
            src="/images/card4.png"
            alt="Collage of Pangasinan's three heritage sites: Balungao Hot Spring, Bolinao Lighthouse, and the Hundred Islands"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div>
          <Eyebrow>A Place to Discover</Eyebrow>
          <Heading level={2} className="mt-2">
            Built for Travelers, Backed by the Province
          </Heading>
          <Body muted className="mt-3 max-w-sm">
            It&rsquo;s no coincidence Pangasinan keeps landing on
            must-visit lists — 124 islands, a lighthouse older than the
            province&rsquo;s cityhood, and hot springs fed by Mount
            Balungao all sit within a few hours of each other.
          </Body>
          <Body muted className="mt-1.5 max-w-sm">
            The Provincial Tourism Office built this showcase so you can
            plan a trip around all three without digging through a
            dozen outdated blog posts — accurate, mobile-friendly, and
            fast even on a spotty signal along the coast.
          </Body>
          <div className="mt-3">
            <Button href="#heritage-sites" variant="solid">
              Start Planning
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
