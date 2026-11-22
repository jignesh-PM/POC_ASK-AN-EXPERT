"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Check, Eye, EyeOff, FileText, PackageSearch, RefreshCw } from "@/app/components/Icon";
import { officialSiteIndex } from "../lib/site-index";
import { productMasters } from "../lib/mock-data";
import { getDefaultCatalogSettings, readCatalogSettings, writeCatalogSettings, type CatalogSettings } from "../lib/catalog-settings";

type CatalogTab = "products" | "documents";

export default function IndexedCatalogManager() {
  const [tab, setTab] = useState<CatalogTab>("products");
  const [settings, setSettings] = useState<CatalogSettings>(getDefaultCatalogSettings);
  const [saved, setSaved] = useState(false);
  useEffect(() => setSettings(readCatalogSettings()), []);

  const visibleProductCount = useMemo(() => productMasters.flatMap((master) => master.subcategories).filter((product) => !settings.hiddenProductIds.includes(product.id)).length, [settings.hiddenProductIds]);
  const visibleDocumentCount = officialSiteIndex.filter((resource) => !settings.hiddenDocumentIds.includes(resource.id)).length;
  const commit = (next: CatalogSettings) => {
    setSettings(next);
    writeCatalogSettings(next);
    try {
      const audit = JSON.parse(window.localStorage.getItem("morgan-admin-audit-log") || "[]") as { action: string; detail: string; at: string }[];
      const nextAudit = [{ action: "Catalog settings updated", detail: "Products, documents or expert team mapping", at: new Date().toISOString() }, ...audit].slice(0, 100);
      window.localStorage.setItem("morgan-admin-audit-log", JSON.stringify(nextAudit));
      window.dispatchEvent(new Event("morgan-admin-audit-updated"));
    } catch { /* Catalog updates remain available if audit storage is full. */ }
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };
  const toggleProduct = (id: string) => commit({ ...settings, hiddenProductIds: settings.hiddenProductIds.includes(id) ? settings.hiddenProductIds.filter((item) => item !== id) : [...settings.hiddenProductIds, id] });
  const toggleDocument = (id: string) => commit({ ...settings, hiddenDocumentIds: settings.hiddenDocumentIds.includes(id) ? settings.hiddenDocumentIds.filter((item) => item !== id) : [...settings.hiddenDocumentIds, id] });
  const setTeam = (categoryId: string, expertTeam: string) => commit({ ...settings, expertTeams: { ...settings.expertTeams, [categoryId]: expertTeam } });

  return (
    <section className="admin-index-manager" aria-labelledby="admin-index-title">
      <div className="admin-index-header"><div><p>CONTENT OPERATIONS</p><h2 id="admin-index-title">Indexed product &amp; document data</h2><span>Review indexed records and choose what visitors and customers can see.</span></div><span className={`admin-index-saved ${saved ? "is-saved" : ""}`} role="status">{saved ? <><Check size={14} /> Saved</> : "Saved in this browser"}</span></div>
      <div className="index-source-card"><span className="index-source-icon"><RefreshCw size={17} aria-hidden="true" /></span><div><strong>Source website</strong><a href="https://www.morganthermalceramics.com/" target="_blank" rel="noreferrer">morganthermalceramics.com <ArrowUpRight size={13} aria-hidden="true" /></a><small>Live indexing and database connection are not connected in this prototype. The catalog below is seeded with official source links.</small></div><span className="index-source-status">Seeded catalog</span></div>
      <div className="admin-index-summary"><div><PackageSearch size={17} aria-hidden="true" /><span><strong>{visibleProductCount}</strong> visible product systems</span></div><div><FileText size={17} aria-hidden="true" /><span><strong>{visibleDocumentCount}</strong> visible documents</span></div><div><EyeOff size={17} aria-hidden="true" /><span><strong>{settings.hiddenProductIds.length + settings.hiddenDocumentIds.length}</strong> hidden records</span></div></div>
      <div className="admin-index-tabs" role="tablist" aria-label="Indexed data type"><button className={tab === "products" ? "active" : ""} type="button" role="tab" aria-selected={tab === "products"} onClick={() => setTab("products")}>Products &amp; systems</button><button className={tab === "documents" ? "active" : ""} type="button" role="tab" aria-selected={tab === "documents"} onClick={() => setTab("documents")}>Documents</button></div>

      {tab === "products" ? <div className="admin-index-groups">{productMasters.map((master) => <section className="admin-index-group" key={master.id}><div className="admin-index-group-heading"><div><p>PRODUCT CATEGORY</p><h3>{master.name}</h3></div><label>Default product manager / team<input value={settings.expertTeams[master.id] ?? ""} onChange={(event) => setTeam(master.id, event.target.value)} placeholder="Morgan product team" /></label></div><div className="admin-index-records">{master.subcategories.map((product) => { const visible = !settings.hiddenProductIds.includes(product.id); return <article className="admin-index-record" key={product.id}><span className="admin-index-record-icon"><PackageSearch size={16} aria-hidden="true" /></span><div className="admin-index-record-copy"><strong>{product.name}</strong><p>{product.description}</p><a href={product.url} target="_blank" rel="noreferrer">Official product page <ArrowUpRight size={12} aria-hidden="true" /></a></div><label className="admin-product-team">Product manager / team<input value={settings.expertTeams[product.id] ?? settings.expertTeams[master.id] ?? ""} onChange={(event) => setTeam(product.id, event.target.value)} /></label><span className={`admin-index-visibility ${visible ? "is-visible" : "is-hidden"}`}>{visible ? <Eye size={13} /> : <EyeOff size={13} />}{visible ? "Visible" : "Hidden"}</span><label className="admin-visibility-switch"><input type="checkbox" checked={visible} onChange={() => toggleProduct(product.id)} /><span>{visible ? "Show to customers" : "Hidden from customers"}</span></label></article>; })}</div></section>)}</div> : <div className="admin-index-records admin-document-records">{officialSiteIndex.map((resource) => { const visible = !settings.hiddenDocumentIds.includes(resource.id); return <article className="admin-index-record" key={resource.id}><span className="admin-index-record-icon"><FileText size={16} aria-hidden="true" /></span><div className="admin-index-record-copy"><strong>{resource.title}</strong><p>{resource.type} Â· {resource.category} â€” {resource.summary}</p><a href={resource.url} target="_blank" rel="noreferrer">Official source <ArrowUpRight size={12} aria-hidden="true" /></a></div><span className={`admin-index-visibility ${visible ? "is-visible" : "is-hidden"}`}>{visible ? <Eye size={13} /> : <EyeOff size={13} />}{visible ? "Visible" : "Hidden"}</span><label className="admin-visibility-switch"><input type="checkbox" checked={visible} onChange={() => toggleDocument(resource.id)} /><span>{visible ? "Show to customers" : "Hidden from customers"}</span></label></article>; })}</div>}
    </section>
  );
}