/** @type {import('next').NextConfig} */
const nextConfig = {
  // GitHub Pages serves plain static files with no Node.js server behind
  // them, so the app has to be pre-rendered to static HTML/CSS/JS at
  // build time rather than relying on Next's normal server runtime.
  output: "export",

  // This repo deploys to a *project* Pages site —
  // https://frensesblisehneedshelp3.github.io/heritage_showcase/ — not
  // a *user* Pages site at the domain root, so every internal link and
  // asset path needs the repo name prefixed or it'll 404 (the browser
  // would otherwise look for /images/... at the domain root instead of
  // /heritage_showcase/images/...). next/image and next/link rewrite
  // this automatically wherever they're used; this is what tells them
  // what to prefix with.
  basePath: "/heritage_showcase",
  assetPrefix: "/heritage_showcase/",

  // Static export writes each route as .../route/index.html; GitHub
  // Pages' static file server needs the matching trailing-slash URL
  // shape to find it without a server-side rewrite step.
  trailingSlash: true,

  // next/image's built-in optimizer (the /_next/image endpoint) needs a
  // running Node server to resize/reformat images on request — that
  // doesn't exist in a static export. A custom loader (lib/imageLoader.ts)
  // replaces it instead of just setting `unoptimized: true` — that flag
  // looks like the obvious fix, but it makes next/image skip its own
  // URL-building step entirely, which is also where basePath prefixing
  // happens; every image would then request `/images/foo.jpg` at the
  // domain root instead of `/heritage_showcase/images/foo.jpg` and
  // 404 in production. The custom loader keeps that prefixing while
  // skipping only the real (server-dependent) optimization step.
  images: {
    loader: "custom",
    loaderFile: "./lib/imageLoader.ts",
  },
};

export default nextConfig;
