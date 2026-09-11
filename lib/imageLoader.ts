/**
 * Custom next/image loader for the static GitHub Pages export.
 *
 * Why this exists instead of `images.unoptimized: true`: that flag
 * makes next/image skip its own URL-building logic completely and
 * render the raw `src` prop untouched — but basePath prefixing
 * ("/heritage_showcase") only happens as *part of* that URL-building
 * step (normally the default loader builds `${basePath}/_next/image?url=...`).
 * Skip the loader, and you skip the prefix too — every image would
 * request `/images/foo.jpg` at the domain root instead of
 * `/heritage_showcase/images/foo.jpg` and 404 in production, even
 * though local dev (no basePath there) hides the problem completely.
 *
 * A custom loader keeps the normal next/image codepath (so this
 * prefixing still happens) while skipping the real optimizer, which
 * needs a Node server we don't have in a static export. There's no
 * resize server to ask for a specific width/quality, so this just
 * returns the same full-size image regardless of the `width` argument
 * next/image passes in — next/image still generates a `srcset` with
 * several width descriptors, they just all point at the same file. No
 * real responsive-size savings, but no broken images either, and this
 * project's real "serve less than the full photo" work already
 * happens via `sizes` on HeritageImage picking a sensible layout width.
 */
export default function imageLoader({ src }: { src: string; width: number; quality?: number }): string {
  const basePath = "/heritage_showcase";
  return `${basePath}${src}`;
}
