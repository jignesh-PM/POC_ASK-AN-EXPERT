"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Calculator, FileText } from "@/app/components/Icon";

type Certificate = { id: string; name: string; product: string; region: string; uploadedAt: string; dataUrl?: string };
type ToolRecord = { gasFactor?: string; electricityFactor?: string; certificates?: Certificate[] };

export default function ToolRunner({ slug, title, description, restricted }: { slug: string; title: string; description: string; restricted: boolean }) {
  const [ready, setReady] = useState(false);
  const [accessAllowed, setAccessAllowed] = useState(true);
  const [role, setRole] = useState("Visitor");
  const [profileComplete, setProfileComplete] = useState(false);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [region, setRegion] = useState("EMEA");
  const [search, setSearch] = useState("");
  const [factor, setFactor] = useState(0.202);
  const [energy, setEnergy] = useState("natural-gas");
  const [consumption, setConsumption] = useState("10000");
  const [output, setOutput] = useState<number | null>(null);

  useEffect(() => {
    const activeRole = window.localStorage.getItem("prototype-role") || "Visitor";
    let adminSettings: { requireProfile?: boolean; defaultRegion?: string } = {};
    let toolData: ToolRecord = {};
    let isComplete = false;
    try { adminSettings = JSON.parse(window.localStorage.getItem("morgan-admin-settings") || "{}"); } catch { /* Use default settings. */ }
    try { toolData = JSON.parse(window.localStorage.getItem("morgan-admin-restricted-tool-data") || "{}"); } catch { /* Use empty tool records. */ }
    try {
      const profile = JSON.parse(window.localStorage.getItem("morgan-profile-details") || "{}");
      const email = window.localStorage.getItem("morgan-profile-email") || "";
      const required = ["name", "designation", "organizationName", "organizationSize", "organizationAddress", "postalCode", "city", "state", "mobileNumber", "emailAddress"];
      isComplete = required.every((key) => String(profile[key] || (key === "emailAddress" ? email : "")).trim());
    } catch { isComplete = false; }
    setRole(activeRole);
    setProfileComplete(isComplete);
    setAccessAllowed(!restricted || !adminSettings.requireProfile || ((activeRole === "Customer" || activeRole === "Visitor") && isComplete) || activeRole === "Morgan User" || activeRole === "Super Admin");
    setRegion(window.localStorage.getItem("morgan-region") || adminSettings.defaultRegion || "EMEA");
    setCertificates(toolData.certificates || []);
    setFactor(Number(toolData.gasFactor || 0.202));
    setReady(true);
  }, [restricted]);

  const visibleCertificates = useMemo(() => certificates.filter((certificate) => (certificate.region === region || certificate.region === "Global") && `${certificate.product} ${certificate.name}`.toLowerCase().includes(search.toLowerCase())), [certificates, region, search]);
  const isMorgan = role === "Morgan User" || role === "Super Admin";
  const calculate = () => {
    const data: ToolRecord = (() => { try { return JSON.parse(window.localStorage.getItem("morgan-admin-restricted-tool-data") || "{}"); } catch { return {}; } })();
    const activeFactor = Number(energy === "electricity" ? data.electricityFactor || 0.4 : data.gasFactor || 0.202);
    setFactor(activeFactor);
    setOutput(Math.max(0, Number(consumption) || 0) * activeFactor / 1000);
  };

  if (!ready) return <section className="tool-page">Loading toolâ€¦</section>;
  if (!accessAllowed) return <section className="tool-page tool-access-gate"><span><BadgeCheck size={22} /></span><h2>Complete your profile to continue</h2><p>This restricted tool needs your organization and contact details. Your question and product context stay available.</p><Link href={profileComplete ? "/sign-in" : "/profile"}>{profileComplete ? "Sign in to continue" : "Complete your profile"}<ArrowRight size={15} /></Link></section>;

  if (slug === "pfp-certificates") return <section className="tool-page tool-certificate-browser"><div><h2>Regional certificates</h2><p>Search published certificates for your selected region.</p></div><div className="tool-filter-row"><label>Search product<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="FireMaster duct wrap" /></label><label>Region<select value={region} onChange={(event) => setRegion(event.target.value)}><option>EMEA</option><option>Americas</option><option>Asia Pacific</option><option>Australia</option></select></label></div>{visibleCertificates.length ? visibleCertificates.map((certificate) => <article className="tool-certificate-record" key={certificate.id}><FileText size={17} /><span><strong>{certificate.product}</strong><small>{certificate.name} Â· {certificate.region}</small></span>{certificate.dataUrl && <a href={certificate.dataUrl} download={certificate.name}>Download certificate</a>}</article>) : <p className="tool-empty-result">No portal certificates match this region and search. <a href="https://www.morganthermalceramics.com/en-gb/about-us/integrated-quality-management-systems/" target="_blank" rel="noreferrer">Check Morgan&apos;s published certificates</a>.</p>}</section>;

  if (slug === "co2-estimation") return <section className="tool-page tool-co2-calculator"><div><h2><Calculator size={18} /> Estimate annual energy emissions</h2><p>Use the emission factors maintained by Morgan administrators.</p></div><div className="tool-filter-row"><label>Energy source<select value={energy} onChange={(event) => { setEnergy(event.target.value); setOutput(null); }}><option value="natural-gas">Natural gas</option><option value="electricity">Electricity</option></select></label><label>Annual consumption (kWh)<input type="number" min="0" value={consumption} onChange={(event) => { setConsumption(event.target.value); setOutput(null); }} /></label></div><button type="button" onClick={calculate}>Calculate estimate</button>{output !== null && <p className="tool-co2-result">Estimated emissions: <strong>{output.toLocaleString(undefined, { maximumFractionDigits: 2 })} tonnes COâ‚‚e per year</strong><small>Calculation uses the current Morgan factor ({factor} kg COâ‚‚e/kWh for natural gas baseline).</small></p>}</section>;

  return <section className="tool-page"><h2>{title}</h2><p>{description}</p><p className="tool-empty-result">This tool is available in the portal prototype. Contact your Morgan representative for application specific guidance.</p>{isMorgan && <small>Expert preview access is enabled.</small>}</section>;
}