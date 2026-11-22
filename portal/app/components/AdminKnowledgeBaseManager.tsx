"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowUpRight, Check, Eye, EyeOff, FileText, Plus, Trash2 } from "@/app/components/Icon";
import { categories } from "../lib/mock-data";
import { readAdminKnowledgeBase, writeAdminKnowledgeBase, type AdminKnowledgeResource } from "../lib/admin-knowledge-base";
import type { IndexedResource } from "../lib/site-index";

const documentTypes: IndexedResource["type"][] = ["Datasheet", "SDS", "Installation manual", "Technical paper", "Certificate"];

export default function AdminKnowledgeBaseManager() {
  const [resources, setResources] = useState<AdminKnowledgeResource[]>([]);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState(categories[0]?.name ?? "Fibres");
  const [type, setType] = useState<IndexedResource["type"]>("Technical paper");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  useEffect(() => setResources(readAdminKnowledgeBase()), []);

  const commit = (next: AdminKnowledgeResource[], action: string, detail: string) => {
    setResources(next);
    writeAdminKnowledgeBase(next);
    try {
      const audit = JSON.parse(window.localStorage.getItem("morgan-admin-audit-log") || "[]") as { action: string; detail: string; at: string }[];
      window.localStorage.setItem("morgan-admin-audit-log", JSON.stringify([{ action, detail, at: new Date().toISOString() }, ...audit].slice(0, 100)));
      window.dispatchEvent(new Event("morgan-admin-audit-updated"));
    } catch { /* Keep content changes independent from the audit log. */ }
    setSaved(true); window.setTimeout(() => setSaved(false), 1800);
  };
  const addResource = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let parsedUrl: URL;
    try { parsedUrl = new URL(url); } catch { setError("Enter a valid HTTPS source URL."); return; }
    if (parsedUrl.protocol !== "https:") { setError("Only secure HTTPS source links are allowed."); return; }
    const id = `admin-${Date.now()}`;
    const entry: AdminKnowledgeResource = { id, title: title.trim(), summary: summary.trim(), url: parsedUrl.href, category, type, locale: "en-gb", keywords: `${title} ${summary} ${category}`.toLowerCase().split(/\s+/).filter(Boolean), visible: true, uploadedAt: new Date().toISOString() };
    if (!entry.title || !entry.summary) { setError("Add a title and a short summary."); return; }
    commit([entry, ...resources], "Knowledge item added", entry.title);
    setTitle(""); setSummary(""); setUrl(""); setError("");
  };
  const toggle = (item: AdminKnowledgeResource) => commit(resources.map((resource) => resource.id === item.id ? { ...resource, visible: !resource.visible } : resource), item.visible ? "Knowledge item hidden" : "Knowledge item published", item.title);

  return <section className="admin-feature-section admin-knowledge-manager"><div className="admin-feature-heading"><div><h2>Knowledge base sources</h2><p>Add and manage technical source links used in the customer document library and question recommendations.</p></div>{saved && <span className="admin-index-saved is-saved"><Check size={14} />Saved</span>}</div>
    <form className="admin-knowledge-form" onSubmit={addResource}><label>Document title<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Technical guide title" required /></label><label>Secure source URL<input type="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://www.morganthermalceramics.com/..." required /></label><label>Product line<select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item.slug}>{item.name}</option>)}</select></label><label>Document type<select value={type} onChange={(event) => setType(event.target.value as IndexedResource["type"])}>{documentTypes.map((item) => <option key={item}>{item}</option>)}</select></label><label className="admin-knowledge-summary">Short summary<textarea value={summary} onChange={(event) => setSummary(event.target.value)} rows={2} placeholder="A concise description to help search and recommendations." required /></label><button type="submit"><Plus size={14} />Add source</button></form>
    {error && <p className="admin-form-error" role="alert">{error}</p>}
    <div className="admin-knowledge-list">{resources.map((resource) => <article key={resource.id}><FileText size={15} /><span><strong>{resource.title}</strong><small>{resource.category} Â· {resource.type}</small></span><a href={resource.url} target="_blank" rel="noreferrer" aria-label={`Open ${resource.title}`}><ArrowUpRight size={14} /></a><button type="button" onClick={() => toggle(resource)} aria-label={resource.visible ? "Hide source" : "Publish source"}>{resource.visible ? <Eye size={14} /> : <EyeOff size={14} />}</button><button type="button" onClick={() => commit(resources.filter((item) => item.id !== resource.id), "Knowledge item removed", resource.title)} aria-label={`Remove ${resource.title}`}><Trash2 size={14} /></button></article>)}{!resources.length && <p className="admin-empty-note">No additional sources added.</p>}</div>
  </section>;
}