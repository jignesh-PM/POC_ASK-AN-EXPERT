"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, BadgeCheck, Globe2, ShieldCheck } from "@/app/components/Icon";
import { qualityCertificatesUrl, morganLocationsUrl, regionalCertifications, regionOptions } from "../lib/compliance-data";
import { catalogSettingsUpdatedEvent, readCatalogSettings } from "../lib/catalog-settings";

export default function RegionalCompliance() {
  const [region, setRegion] = useState("EMEA");
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  useEffect(() => {
    const sync = () => {
      setRegion(window.localStorage.getItem("morgan-region") || "EMEA");
      setHiddenIds(readCatalogSettings().hiddenCertificationIds);
    };
    sync();
    window.addEventListener("morgan-region-change", sync);
    window.addEventListener("storage", sync);
    window.addEventListener(catalogSettingsUpdatedEvent, sync);
    return () => {
      window.removeEventListener("morgan-region-change", sync);
      window.removeEventListener("storage", sync);
      window.removeEventListener(catalogSettingsUpdatedEvent, sync);
    };
  }, []);
  const selectedRegion = regionalCertifications[region] ?? regionalCertifications.EMEA;
  const visible = selectedRegion.certifications.filter((cert) => !hiddenIds.includes(`${region}:${cert.id}`));
  return <section className="regional-compliance" aria-labelledby="regional-compliance-title">
    <div className="regional-compliance-top"><div className="regional-compliance-intro"><span className="regional-compliance-mark"><ShieldCheck size={20} aria-hidden="true" /></span><div><p>QUALITY &amp; COMPLIANCE</p><h2 id="regional-compliance-title">Certified management systems</h2><span>Explore certifications published for Morgan locations in your region.</span></div></div>
      <label className="compliance-region-select"><Globe2 size={15} aria-hidden="true" /><span>Region</span><select value={region} onChange={(event) => { const value = event.target.value; setRegion(value); window.localStorage.setItem("morgan-region", value); window.dispatchEvent(new Event("morgan-region-change")); }} aria-label="Certification region">{regionOptions.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
    </div>
    <div className="compliance-region-caption"><strong>{selectedRegion.label}</strong><span>Locations listed for {selectedRegion.sourceRegion}</span></div>
    {visible.length ? <div className="compliance-cert-grid">{visible.map((cert) => <article className="compliance-cert-card" key={cert.id}><span className="compliance-cert-icon"><BadgeCheck size={18} aria-hidden="true" /></span><div><h3>{cert.standard}</h3><p>{cert.name}</p><span className="compliance-location-count">{cert.locations.length} certified {cert.locations.length === 1 ? "location" : "locations"}</span><details><summary>View locations</summary><ul>{cert.locations.map((location) => <li key={location}>{location}</li>)}</ul></details></div></article>)}</div> : <div className="compliance-empty"><p>No region-specific ISO certificates are listed for {selectedRegion.label} in the current source index.</p><a href={morganLocationsUrl} target="_blank" rel="noreferrer">Explore Morgan locations <ArrowUpRight size={13} /></a></div>}
    <div className="compliance-footer"><span>Certificate coverage follows Morganâ€™s published quality index.</span><div><a href={qualityCertificatesUrl} target="_blank" rel="noreferrer">View certificates <ArrowUpRight size={13} /></a><a href={morganLocationsUrl} target="_blank" rel="noreferrer">Our locations <ArrowUpRight size={13} /></a></div></div>
  </section>;
}