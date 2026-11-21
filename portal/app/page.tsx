"use client";

import { useState } from "react";
import Link from "next/link";
import { mainAreas } from "./lib/mock-data";
import { officialSiteIndex, searchIndexedResources, getMockAiAnswer } from "./lib/site-index";
import HomeMotion from "./components/HomeMotion";
import ThreeBackdrop from "./components/ThreeBackdrop";
import ProfileCompletionPrompt from "./components/ProfileCompletionPrompt";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [aiOpen, setAiOpen] = useState(false);

  const searchResults = submittedQuery ? searchIndexedResources(submittedQuery) : officialSiteIndex.slice(0, 3);
  const aiResult = getMockAiAnswer(submittedQuery, searchResults);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (!searchQuery.trim()) return;
    setSubmittedQuery(searchQuery.trim());
    setAiOpen(true);
  };

  return (
    <>
      <main className="morgan-home">
        <HomeMotion />
        <ProfileCompletionPrompt />
        <section className="morgan-hero">
          <div className="engineering-nav">
            <p>ENGINEERING SUPPORT</p>
            <Link href="/main-area/engineering-design"><span>01</span><b>Thermal insulation system design</b></Link>
            <Link href="/main-area/product-information"><span>02</span><b>Material selection & specification</b></Link>
            <Link href="/tools/heat-flow"><span>03</span><b>Heat loss analysis & calculations</b></Link>
            <Link href="/documents"><span>04</span><b>Technical documentation</b></Link>
            <Link href="/main-area/supervision-service"><span>05</span><b>Installation support & QA/QC</b></Link>
            <Link href="/questions"><span>06</span><b>Ongoing technical support</b></Link>
          </div>

          <ThreeBackdrop />

          <div className="search-focus">
            <div className="hero-kicker"><span /> ASK THE EXPERT</div>
            <h1>How can we help?</h1>
            <p>Search technical resources or ask a question about Morgan Thermal Ceramics products.</p>
            <form className="index-search" onSubmit={submitSearch}>
              <label htmlFor="official-search">Search the Morgan index</label>
              <div>
                <input id="official-search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Ask a question or search products, datasheets, manuals…" />
                <button type="submit">Search <span>→</span></button>
              </div>
            </form>
            <div className="search-suggestions">
              <span>Popular searches</span>
              {["WDS board", "Castable dry-out", "SDS documents", "FireMaster certificate"].map((item) => (
                <button type="button" key={item} onClick={() => { setSearchQuery(item); setSubmittedQuery(item); setAiOpen(true); }}>{item}</button>
              ))}
            </div>
          </div>
        </section>

        {aiOpen && (
          <section className="ai-results" aria-live="polite">
            <div className="ai-answer-card">
              <div className="ai-answer-head"><span>AI</span><div><p>Morgan AI assistant</p><h2>Answer from the official-site index</h2></div></div>
              <p className="ai-answer-text">{aiResult.answer}</p>
              <div className="ai-actions">
                <Link className="ai-contact-action" href="/questions">Talk to an expert</Link>
                <button type="button" onClick={() => setSubmittedQuery("")}>Clear answer</button>
              </div>
              <small>This is a prototype. Technical decisions should be confirmed with a Morgan expert.</small>
            </div>
            <div className="source-card">
              <p>SOURCED FROM</p>
              {searchResults.map((resource) => (
                <a href={resource.url} target="_blank" rel="noreferrer" key={resource.id}><span>{resource.type}</span><b>{resource.title}</b><em>{resource.category} · Official site</em></a>
              ))}
            </div>
          </section>
        )}

        <section className="portal-overview">
          <div className="overview-heading"><div><p>MAIN AREAS</p><h2>Technical resources</h2></div><Link href="/categories">Browse all categories →</Link></div>
          <div className="overview-grid">
            {mainAreas.map((area) => <Link href={`/main-area/${area.slug}`} className="overview-card" key={area.slug}><span>{area.count}</span><h3>{area.title}</h3><p>{area.description}</p><b>Explore</b></Link>)}
          </div>
        </section>
      </main>

    </>
  );
}
