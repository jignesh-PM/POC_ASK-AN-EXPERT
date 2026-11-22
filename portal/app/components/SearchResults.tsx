"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, FileText, PackageSearch, Sparkles } from "@/app/components/Icon";
import { categories, industries, products } from "../lib/mock-data";
import { getMockAiAnswer, searchIndexedResources } from "../lib/site-index";
import { catalogSettingsUpdatedEvent, getDefaultCatalogSettings, readCatalogSettings } from "../lib/catalog-settings";
import { expertRoutingStorageKey, type SearchRoutingRequest } from "../lib/expert-routing";
import { adminKnowledgeBaseUpdatedEvent, readAdminKnowledgeBase, type AdminKnowledgeResource } from "../lib/admin-knowledge-base";

export default function SearchResults({ query, industryId, productId, expertTeam }: { query: string; industryId: string; productId: string; expertTeam: string }) {
  const [settings, setSettings] = useState(getDefaultCatalogSettings);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [history, setHistory] = useState<SearchRoutingRequest[]>([]);
  const [expertConversationStarted, setExpertConversationStarted] = useState(false);
  const [adminResources, setAdminResources] = useState<AdminKnowledgeResource[]>([]);
  useEffect(() => {
    const sync = () => { setSettings(readCatalogSettings()); setAdminResources(readAdminKnowledgeBase().filter((resource) => resource.visible)); setSettingsLoaded(true); };
    sync();
    window.addEventListener(catalogSettingsUpdatedEvent, sync);
    window.addEventListener(adminKnowledgeBaseUpdatedEvent, sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener(catalogSettingsUpdatedEvent, sync); window.removeEventListener(adminKnowledgeBaseUpdatedEvent, sync); window.removeEventListener("storage", sync); };
  }, []);
  useEffect(() => {
    try {
      const requests = JSON.parse(window.localStorage.getItem(expertRoutingStorageKey) || "[]") as SearchRoutingRequest[];
      const latestCurrent = requests.find((request) => request.query === query && request.industryId === industryId && request.productId === productId);
      setExpertConversationStarted(latestCurrent?.status === "Expert follow-up requested" || latestCurrent?.status === "In live chat");
      setHistory(requests.filter((request) => request.industryId === industryId && request.productId === productId && request.id !== latestCurrent?.id).slice(0, 8).reverse());
    } catch { setHistory([]); }
  }, [industryId, productId, query]);

  const selectedIndustry = industries.find((industry) => industry.id === industryId);
  const selectedProduct = products.find((product) => product.id === productId);
  const category = selectedProduct ? categories.find((item) => item.slug === selectedProduct.category) : undefined;
  const resources = useMemo(() => {
    const term = `${query} ${selectedProduct?.name ?? ""} ${category?.name ?? ""}`.trim().toLowerCase();
    const indexed = searchIndexedResources(term).filter((resource) => !settings.hiddenDocumentIds.includes(resource.id));
    const managed = adminResources.filter((resource) => resource.category === category?.name || !category).filter((resource) => `${resource.title} ${resource.summary} ${resource.category} ${resource.keywords.join(" ")}`.toLowerCase().includes(term));
    return [...indexed, ...managed];
  }, [adminResources, category?.name, query, selectedProduct?.name, settings.hiddenDocumentIds]);
  const productResults = useMemo(() => products.filter((product) => {
    const matchesIndustry = !industryId || product.industryIds.includes(industryId);
    const matchesQuery = !query || `${product.name} ${product.description} ${product.categoryName}`.toLowerCase().includes(query.toLowerCase()) || product.id === productId;
    return matchesIndustry && matchesQuery && !settings.hiddenProductIds.includes(product.id);
  }).filter((product) => product.id === productId || resources.some((resource) => resource.category === product.categoryName)), [industryId, productId, query, resources, settings.hiddenProductIds]);
  const answer = getMockAiAnswer(query, resources);
  const askExpertParams = new URLSearchParams({ q: query, industry: industryId, product: productId, team: expertTeam });

  return <main className="simple-page search-experience-page chat-search-page">
    <div className="simple-head"><p className="eyebrow">MORGAN AI Â· PRODUCT &amp; DOCUMENT KNOWLEDGE</p><h1>Ask Morgan AI</h1><p>Get an answer from Morgan product information and approved documents. Ask follow-up questions in the sticky AI chat.</p>{(selectedIndustry || selectedProduct || expertTeam) && <div className="chat-context-pills">{selectedIndustry && <span>{selectedIndustry.name}</span>}{selectedProduct && <span>{selectedProduct.name}</span>}{expertTeam && <span>Expert team Â· {expertTeam}</span>}</div>}</div>
    <div className="search-chat-canvas" aria-label="Question and answer conversation">
      {history.length > 0 && <section className="chat-history" aria-label="Earlier questions in this conversation">{history.map((item) => { const pastResources = searchIndexedResources(`${item.query} ${item.product}`).filter((resource) => !settings.hiddenDocumentIds.includes(resource.id)); const pastAnswer = getMockAiAnswer(item.query, pastResources); return <article className="chat-turn" key={item.id}><div className="chat-user-message"><span>You</span><p>{item.query}</p></div><div className="chat-assistant-message"><span><Sparkles size={14} aria-hidden="true" /> Morgan answer</span><p>{pastAnswer.answer}</p></div></article>; })}</section>}
      <section className="chat-turn chat-current-turn" aria-label="Current question and answer">
        <div className="chat-user-message"><span>You</span><p>{query || "Browse Morgan resources"}</p></div>
        <div className="chat-assistant-message"><span><Sparkles size={14} aria-hidden="true" /> Morgan answer</span><p>{answer.answer}</p>
          <section className="chat-recommended-docs" aria-labelledby="recommended-docs-title"><div className="chat-recommended-heading"><div><span>FROM MORGAN&apos;S OFFICIAL WEBSITE</span><h2 id="recommended-docs-title">Recommended documentation</h2></div><span>{resources.length} matches</span></div>{resources.length ? <div className="chat-recommended-grid">{resources.slice(0, 3).map((resource) => <a className="chat-recommended-card" href={resource.url} target="_blank" rel="noreferrer" key={resource.id}><span className="chat-recommended-icon"><FileText size={17} aria-hidden="true" /></span><span className="chat-recommended-copy"><small>{resource.type} Â· {resource.category}</small><strong>{resource.title}</strong><span>{resource.summary}</span><b>Open on Morgan website <ArrowUpRight size={12} aria-hidden="true" /></b></span></a>)}</div> : <p className="search-empty-note">No approved documents matched this question. <Link href="/documents">Browse the document library</Link>.</p>}</section>
          {selectedProduct && !expertConversationStarted && <div className="search-follow-up"><div><h2>Need a human expert?</h2><p>Start a separate chat with {expertTeam || "the Morgan subject matter expert team"}. Your product and industry context will be included.</p></div><Link href={`/questions?${askExpertParams.toString()}`}>Talk to an expert <ArrowRight size={15} aria-hidden="true" /></Link></div>}
        </div>
      </section>
    </div>
    <section className="contextual-product-results" aria-labelledby="contextual-products-title"><div className="search-results-heading"><div><p>PRODUCTS &amp; SYSTEMS</p><h2 id="contextual-products-title">Related products</h2></div><span>{settingsLoaded ? `${productResults.length} results` : "Loading"}</span></div>
      {!settingsLoaded ? <p className="search-empty-note">Loading approved product informationâ€¦</p> : productResults.length ? <div className="search-product-grid">{productResults.slice(0, 6).map((product) => <a href={product.url} target="_blank" rel="noreferrer" className="search-product-card" key={product.id}><PackageSearch size={19} aria-hidden="true" /><span>{product.categoryName}</span><h3>{product.name}</h3><p>{product.description}</p><b>Official product page <ArrowUpRight size={14} aria-hidden="true" /></b></a>)}</div> : <p className="search-empty-note">No matching product pages were found. Browse the <Link href="/categories">full product catalogue</Link>.</p>}
    </section>
  </main>;
}