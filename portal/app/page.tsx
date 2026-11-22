"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Headset, Sparkles } from "@/app/components/Icon";
import { categories, mainAreas, products } from "./lib/mock-data";
import { catalogSettingsUpdatedEvent, getDefaultCatalogSettings, readCatalogSettings } from "./lib/catalog-settings";
import RegionalCompliance from "./components/RegionalCompliance";
import PortalAmbientCanvas from "./components/PortalAmbientCanvas";

export default function Home() {
  const router = useRouter();
  const [catalogSettings, setCatalogSettings] = useState(getDefaultCatalogSettings);
  const [hiddenAreas, setHiddenAreas] = useState<string[]>([]);

  useEffect(() => {
    const syncSettings = () => setCatalogSettings(readCatalogSettings());
    const syncVisibility = () => { try { setHiddenAreas(JSON.parse(window.localStorage.getItem("morgan-admin-main-area-visibility") || "[]") as string[]); } catch { setHiddenAreas([]); } };
    syncSettings();
    syncVisibility();
    window.addEventListener(catalogSettingsUpdatedEvent, syncSettings);
    window.addEventListener("storage", syncVisibility);
    window.addEventListener("morgan-admin-content-updated", syncVisibility);
    return () => { window.removeEventListener(catalogSettingsUpdatedEvent, syncSettings); window.removeEventListener("storage", syncVisibility); window.removeEventListener("morgan-admin-content-updated", syncVisibility); };
  }, []);

  useEffect(() => {
    const role = window.localStorage.getItem("prototype-role");
    if (role === "Morgan User") router.replace("/expert");
    else if (role === "Super Admin") router.replace("/admin");
  }, [router]);

  return (
    <main className="morgan-home home-discovery home-search-highlighted">
      <PortalAmbientCanvas />
      <section className="home-discovery-sections" aria-label="Browse Morgan resources">
        <section className="home-conversation-options" aria-labelledby="home-help-title"><div className="home-conversation-heading"><p>CHOOSE YOUR SUPPORT</p><h2 id="home-help-title">How can we help?</h2><span>Get a quick answer from Morgan knowledge, or speak directly with a product specialist.</span></div><div className="home-conversation-grid"><article className="home-conversation-card home-ai-card"><span className="home-conversation-icon"><Sparkles size={19} aria-hidden="true" /></span><div><p>MORGAN AI</p><h3>Product and document answers</h3><span>Search approved product information and technical documents. Choose an industry and product in the sticky search bar.</span></div><button type="button" onClick={() => { const prompt = document.getElementById("morgan-ai-prompt"); prompt?.scrollIntoView({ behavior: "smooth", block: "nearest" }); prompt?.focus({ preventScroll: true }); }}>Start AI chat <ArrowRight size={14} aria-hidden="true" /></button></article><article className="home-conversation-card home-expert-card"><span className="home-conversation-icon"><Headset size={19} aria-hidden="true" /></span><div><p>SUBJECT MATTER EXPERT</p><h3>Talk with a Morgan expert</h3><span>Send your question to the team assigned to your selected product line and continue in a human chat.</span></div><Link href="/questions?mode=expert">Start expert chat <ArrowRight size={14} aria-hidden="true" /></Link></article></div></section>
        <div className="home-section-heading"><div><p>EXPLORE THE RANGE</p><h2>Products</h2></div><Link href="/categories">View all products <ArrowRight size={15} aria-hidden="true" /></Link></div>
        <div className="home-product-grid">{categories.filter((category) => products.some((product) => product.category === category.slug && !catalogSettings.hiddenProductIds.includes(product.id))).map((category) => <Link href={`/category/${category.slug}`} className="home-product-card" key={category.slug}><span>{products.filter((product) => product.category === category.slug && !catalogSettings.hiddenProductIds.includes(product.id)).length} product systems</span><h3>{category.name}</h3><p>{category.description}</p><b>Explore range <ArrowRight size={14} aria-hidden="true" /></b></Link>)}</div>
        <div className="home-resource-row"><div><p>TECHNICAL LIBRARY</p><h2>Need a datasheet, manual or certificate?</h2><span>Browse Morgan product and application documents in one place.</span></div><Link href="/documents">Browse documents <ArrowRight size={15} aria-hidden="true" /></Link></div>
        <div className="home-support-links">{mainAreas.filter((area) => !hiddenAreas.includes(area.slug)).slice(0, 3).map((area) => <Link href={`/main-area/${area.slug}`} key={area.slug}>{area.title}<ArrowRight size={14} aria-hidden="true" /></Link>)}</div>
        <RegionalCompliance />
      </section>
    </main>
  );
}
