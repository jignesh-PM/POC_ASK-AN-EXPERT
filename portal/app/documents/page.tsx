"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, FileText, Search } from "@/app/components/Icon";
import { officialSiteIndex, type IndexedResource } from "../lib/site-index";
import { categories } from "../lib/mock-data";
import { catalogSettingsUpdatedEvent, getDefaultCatalogSettings, readCatalogSettings } from "../lib/catalog-settings";
import { adminKnowledgeBaseUpdatedEvent, readAdminKnowledgeBase } from "../lib/admin-knowledge-base";

type ResourceType = "All types" | IndexedResource["type"];

export default function DocumentsPage() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<ResourceType>("All types");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [catalogSettings, setCatalogSettings] = useState(getDefaultCatalogSettings);
  const [customResources, setCustomResources] = useState<IndexedResource[]>([]);
  useEffect(() => {
    const sync = () => setCatalogSettings(readCatalogSettings());
    const syncCustom = () => setCustomResources(readAdminKnowledgeBase().filter((resource) => resource.visible));
    sync();
    syncCustom();
    window.addEventListener(catalogSettingsUpdatedEvent, sync);
    window.addEventListener("storage", sync);
    window.addEventListener(adminKnowledgeBaseUpdatedEvent, syncCustom);
    window.addEventListener("storage", syncCustom);
    return () => { window.removeEventListener(catalogSettingsUpdatedEvent, sync); window.removeEventListener("storage", sync); window.removeEventListener(adminKnowledgeBaseUpdatedEvent, syncCustom); window.removeEventListener("storage", syncCustom); };
  }, []);
  const visibleResources = useMemo(() => [...officialSiteIndex.filter((resource) => !catalogSettings.hiddenDocumentIds.includes(resource.id)), ...customResources], [catalogSettings.hiddenDocumentIds, customResources]);
  const results = useMemo(() => visibleResources.filter((resource) => {
    const searchContent = `${resource.title} ${resource.summary} ${resource.category} ${resource.keywords.join(" ")}`.toLowerCase();
    return searchContent.includes(query.trim().toLowerCase()) && (typeFilter === "All types" || resource.type === typeFilter) && (categoryFilter === "all" || resource.category.toLowerCase() === categories.find((category) => category.slug === categoryFilter)?.name.toLowerCase());
  }), [categoryFilter, query, typeFilter, visibleResources]);
  const resourceTypes = Array.from(new Set(visibleResources.map((resource) => resource.type)));

  return (
    <main className="simple-page documents-library-page">
      <div className="simple-head"><p className="eyebrow">TECHNICAL LIBRARY</p><h1>Product documents</h1><p>Search Morgan technical papers, datasheets, safety information and installation guidance.</p></div>
      <section className="document-library-controls" aria-label="Filter documents">
        <label className="document-library-search"><Search size={18} aria-hidden="true" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search titles, products or technical topics" aria-label="Search documents" /></label>
        <label>Document type<select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as ResourceType)}><option>All types</option>{resourceTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
        <label>Product range<select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}><option value="all">All ranges</option>{categories.filter((category) => category.slug !== "engineering").map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}</select></label>
      </section>
      <div className="document-library-summary"><h2>Documents</h2><span>{results.length} {results.length === 1 ? "document" : "documents"}</span></div>
      {results.length ? <div className="document-library-list">{results.map((resource) => <article className="document-library-card" key={resource.id}><span className="document-library-icon"><FileText size={19} aria-hidden="true" /></span><div className="document-library-copy"><div className="document-library-tags"><span>{resource.type}</span><span>{resource.category}</span></div><h3>{resource.title}</h3><p>{resource.summary}</p></div><a href={resource.url} target="_blank" rel="noreferrer">View source <ArrowUpRight size={15} aria-hidden="true" /></a></article>)}</div> : <div className="catalogue-empty"><Search size={22} aria-hidden="true" /><h3>No documents found</h3><p>Try another search term or change the filters.</p><button type="button" onClick={() => { setQuery(""); setTypeFilter("All types"); setCategoryFilter("all"); }}>Clear filters</button></div>}
      <p className="document-source-note">Documents link to Morgan Thermal Ceramics&apos; official website. Availability may vary by product and region.</p>
    </main>
  );
}