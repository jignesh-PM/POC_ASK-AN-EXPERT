"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, FileText, PackageSearch } from "@/app/components/Icon";
import { officialSiteIndex } from "../lib/site-index";
import { categories, products } from "../lib/mock-data";
import { catalogSettingsUpdatedEvent, readCatalogSettings } from "../lib/catalog-settings";
import ProductCommunity from "./ProductCommunity";
import { adminKnowledgeBaseUpdatedEvent, readAdminKnowledgeBase } from "../lib/admin-knowledge-base";
import type { IndexedResource } from "../lib/site-index";

type ProductCategory = (typeof categories)[number];

export default function CategoryDetail({ category }: { category: ProductCategory }) {
  const [hiddenProductIds, setHiddenProductIds] = useState<string[]>([]);
  const [hiddenDocumentIds, setHiddenDocumentIds] = useState<string[]>([]);
  const [customDocuments, setCustomDocuments] = useState<IndexedResource[]>([]);
  useEffect(() => {
    const sync = () => {
      const settings = readCatalogSettings();
      setHiddenProductIds(settings.hiddenProductIds);
      setHiddenDocumentIds(settings.hiddenDocumentIds);
    };
    const syncCustom = () => setCustomDocuments(readAdminKnowledgeBase().filter((resource) => resource.visible));
    sync();
    syncCustom();
    window.addEventListener(catalogSettingsUpdatedEvent, sync);
    window.addEventListener("storage", sync);
    window.addEventListener(adminKnowledgeBaseUpdatedEvent, syncCustom);
    window.addEventListener("storage", syncCustom);
    return () => { window.removeEventListener(catalogSettingsUpdatedEvent, sync); window.removeEventListener("storage", sync); window.removeEventListener(adminKnowledgeBaseUpdatedEvent, syncCustom); window.removeEventListener("storage", syncCustom); };
  }, []);
  const categoryProducts = products.filter((product) => product.category === category.slug && !hiddenProductIds.includes(product.id));
  const categoryDocuments = [...officialSiteIndex.filter((resource) => resource.category === category.name && !hiddenDocumentIds.includes(resource.id)), ...customDocuments.filter((resource) => resource.category === category.name)];

  return (
    <main className="product-category-detail">
      <header className="category-hero category-hero-clean"><div><Link href="/categories">All products</Link><p>PRODUCT RANGE</p><h1>{category.name}</h1><p>{category.description}</p></div></header>
      <section className="category-detail-content">
        <div className="category-detail-heading"><div><p>PRODUCT &amp; SYSTEM MASTER</p><h2>Explore {category.name}</h2><span>Product information and official Morgan links.</span></div><Link href="/">Search by industry <ArrowRight size={15} aria-hidden="true" /></Link></div>
        {categoryProducts.length ? <div className="category-subproduct-grid">{categoryProducts.map((product) => <a className="category-subproduct-card" href={product.url} target="_blank" rel="noreferrer" key={product.id}><span className="category-subproduct-icon"><PackageSearch size={18} aria-hidden="true" /></span><small>{category.name}</small><h3>{product.name}</h3><p>{product.description}</p><b>View on Morgan site <ArrowUpRight size={14} aria-hidden="true" /></b></a>)}</div> : <div className="category-empty-state">No products in this range are currently published.</div>}
        <section className="category-document-section"><div className="category-detail-heading"><div><p>TECHNICAL LIBRARY</p><h2>Related documents</h2></div><Link href="/documents">Browse all documents <ArrowRight size={15} aria-hidden="true" /></Link></div>
          {categoryDocuments.length ? <div className="category-document-list">{categoryDocuments.map((resource) => <a href={resource.url} target="_blank" rel="noreferrer" key={resource.id}><span><FileText size={18} aria-hidden="true" /></span><div><small>{resource.type}</small><h3>{resource.title}</h3><p>{resource.summary}</p></div><ArrowUpRight size={15} aria-hidden="true" /></a>)}</div> : <p className="category-empty-state">No approved documents are published in this category yet.</p>}
        </section>
        <ProductCommunity categoryId={category.slug} categoryName={category.name} />
        <div className="category-advice-cta"><div><span>APPLICATION SUPPORT</span><h2>Need help selecting a product?</h2><p>Share your industry and product context so your question can be directed to the right Morgan team.</p></div><Link href="/">Start a contextual search <ArrowRight size={15} aria-hidden="true" /></Link></div>
      </section>
    </main>
  );
}