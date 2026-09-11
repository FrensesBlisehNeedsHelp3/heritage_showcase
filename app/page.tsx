"use client";

import { useState } from "react";
import Hero from "../components/organisms/Hero";
import HeritageGrid from "../components/organisms/HeritageGrid";
import AboutSection from "../components/organisms/AboutSection";
import Footer from "../components/organisms/Footer";

/**
 * Home — assembles the 3-screen showcase from organisms only.
 * Header is rendered inside Hero (it's fixed, so it sits on top of it
 * and stays pinned across every section as the page scrolls).
 *
 * Owns the `query` search state: the Search Form itself lives in
 * Header (reached via Hero, which just relays the props down) so it's
 * reachable from any screen via the fixed nav, not just screen 1. The
 * filtered results render in Heritage Grid (screen 2) — since neither
 * organism is an ancestor of the other, the state has to live here,
 * above both, and gets handed down as props.
 */
export default function Home() {
  const [query, setQuery] = useState("");

  return (
    <main id="main-content">
      <Hero query={query} onQueryChange={setQuery} />
      <HeritageGrid query={query} />
      <AboutSection />
      <Footer />
    </main>
  );
}
