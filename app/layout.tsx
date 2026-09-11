// Fonts are self-hosted via @fontsource (npm) rather than fetched from
// Google Fonts at request time. That means: zero third-party font
// requests, nothing to fail on a flaky 3G/4G connection or a network
// that blocks fonts.googleapis.com, and no layout shift waiting on an
// external host — directly serving the "lightning fast on mobile data"
// requirement. Weight subsets are limited to only what the design uses.
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/fraunces/500.css";
import "@fontsource/fraunces/600.css";
import "@fontsource/fraunces/700.css";
import "@fontsource/fraunces/900.css";
import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Pangasinan Heritage Digital Showcase",
  description:
    "Discover Pangasinan's iconic heritage sites — the Hundred Islands, Bolinao Lighthouse, and Balungao Hot Spring — presented by the Pangasinan Provincial Tourism Office.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body">
        {/* WCAG 2.4.1 — bypass repeated navigation */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
