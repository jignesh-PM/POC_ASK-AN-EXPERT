"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, BadgeCheck, Check, Eye, EyeOff } from "@/app/components/Icon";
import { qualityCertificatesUrl, regionalCertifications } from "../lib/compliance-data";
import { getDefaultCatalogSettings, readCatalogSettings, writeCatalogSettings, type CatalogSettings } from "../lib/catalog-settings";

export default function RegionalComplianceManager() {
  const [settings, setSettings] = useState<CatalogSettings>(getDefaultCatalogSettings);
  const [saved, setSaved] = useState(false);
  useEffect(() => setSettings(readCatalogSettings()), []);
  const toggle = (key: string) => {
    const hiddenCertificationIds = settings.hiddenCertificationIds.includes(key) ? settings.hiddenCertificationIds.filter((id) => id !== key) : [...settings.hiddenCertificationIds, key];
    const next = { ...settings, hiddenCertificationIds };
    setSettings(next);
    writeCatalogSettings(next);
    try {
      const audit = JSON.parse(window.localStorage.getItem("morgan-admin-audit-log") || "[]") as { action: string; detail: string; at: string }[];
      const nextAudit = [{ action: "Certification visibility changed", detail: key, at: new Date().toISOString() }, ...audit].slice(0, 100);
      window.localStorage.setItem("morgan-admin-audit-log", JSON.stringify(nextAudit));
      window.dispatchEvent(new Event("morgan-admin-audit-updated"));
    } catch { /* The visibility update should not depend on audit storage. */ }
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };
  return <section className="admin-index-manager compliance-admin" aria-labelledby="compliance-admin-title">
    <div className="admin-index-header"><div><p>REGIONAL CONTENT</p><h2 id="compliance-admin-title">ISO certification visibility</h2><span>Choose which regional certifications appear on the customer home page.</span></div><span className={`admin-index-saved ${saved ? "is-saved" : ""}`} role="status">{saved ? <><Check size={14} /> Saved</> : "Saved in this browser"}</span></div>
    <div className="compliance-admin-groups">{Object.entries(regionalCertifications).map(([region, data]) => <section className="compliance-admin-region" key={region}><div><h3>{data.label}</h3><span>Source index: {data.sourceRegion}</span></div>{data.certifications.length ? <div>{data.certifications.map((cert) => { const key = `${region}:${cert.id}`; const visible = !settings.hiddenCertificationIds.includes(key); return <article key={key}><span className="compliance-admin-cert-icon"><BadgeCheck size={16} /></span><div><strong>{cert.standard}</strong><small>{cert.name} Â· {cert.locations.length} locations</small></div><span className={`admin-index-visibility ${visible ? "is-visible" : "is-hidden"}`}>{visible ? <Eye size={13} /> : <EyeOff size={13} />}{visible ? "Visible" : "Hidden"}</span><label className="admin-visibility-switch"><input type="checkbox" checked={visible} onChange={() => toggle(key)} /><span>{visible ? "Show to customers" : "Hidden from customers"}</span></label></article>; })}</div> : <p className="compliance-admin-no-data">No ISO certificates listed for this region.</p>}</section>)}</div>
    <a className="compliance-admin-source" href={qualityCertificatesUrl} target="_blank" rel="noreferrer">Open Morganâ€™s published certificate index <ArrowUpRight size={13} /></a>
  </section>;
}