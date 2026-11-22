"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { Check, Download, FileUp, Trash2 } from "@/app/components/Icon";

type ToolData = { gasFactor: string; electricityFactor: string; certificates: { id: string; name: string; product: string; region: string; uploadedAt: string; dataUrl?: string }[] };
const storageKey = "morgan-admin-restricted-tool-data";
const defaults: ToolData = { gasFactor: "0.202", electricityFactor: "0.40", certificates: [] };

export default function AdminToolDataManager() {
  const [data, setData] = useState<ToolData>(defaults);
  const [saved, setSaved] = useState(false);
  const [product, setProduct] = useState("");
  const [region, setRegion] = useState("EMEA");
  const [error, setError] = useState("");
  useEffect(() => { try { setData({ ...defaults, ...JSON.parse(window.localStorage.getItem(storageKey) || "{}") as Partial<ToolData> }); } catch { setData(defaults); } }, []);

  const persist = (next: ToolData, action: string) => {
    setData(next);
    window.localStorage.setItem(storageKey, JSON.stringify(next));
    const events = JSON.parse(window.localStorage.getItem("morgan-admin-audit-log") || "[]") as { action: string; detail: string; at: string }[];
    const audit = [{ action, detail: "Restricted tools", at: new Date().toISOString() }, ...events].slice(0, 100);
    window.localStorage.setItem("morgan-admin-audit-log", JSON.stringify(audit));
    window.dispatchEvent(new Event("morgan-admin-tool-data-updated"));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  const updateFactor = (key: "gasFactor" | "electricityFactor", value: string) => setData((current) => ({ ...current, [key]: value }));
  const uploadCertificate = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) { setError("Choose a certificate smaller than 1 MB for this local prototype."); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const certificate = { id: `${Date.now()}`, name: file.name, product: product.trim() || "General certificate", region, uploadedAt: new Date().toISOString(), dataUrl: String(reader.result) };
      persist({ ...data, certificates: [certificate, ...data.certificates] }, "Certificate uploaded");
      setProduct(""); setError(""); event.target.value = "";
    };
    reader.onerror = () => setError("The certificate could not be read. Try another file.");
    reader.readAsDataURL(file);
  };

  return <section className="admin-feature-section admin-tool-data" aria-labelledby="admin-tool-data-title">
    <div className="admin-feature-heading"><div><h2 id="admin-tool-data-title">Restricted tool data</h2><p>Maintain COâ‚‚ calculation factors and regional certificate records.</p></div>{saved && <span className="admin-index-saved is-saved"><Check size={14} />Saved</span>}</div>
    <div className="admin-factor-fields"><label>Natural gas factor <small>kg COâ‚‚e / kWh</small><input type="number" min="0" step="0.001" value={data.gasFactor} onChange={(event) => updateFactor("gasFactor", event.target.value)} /></label><label>Electricity factor <small>kg COâ‚‚e / kWh</small><input type="number" min="0" step="0.001" value={data.electricityFactor} onChange={(event) => updateFactor("electricityFactor", event.target.value)} /></label><button type="button" onClick={() => persist(data, "COâ‚‚ factors updated")}>Save factors</button></div>
    <div className="admin-certificate-upload"><label>Product<input value={product} onChange={(event) => setProduct(event.target.value)} placeholder="FireMaster duct wrap" /></label><label>Region<select value={region} onChange={(event) => setRegion(event.target.value)}><option>EMEA</option><option>Americas</option><option>Asia Pacific</option><option>Australia</option></select></label><label className="admin-file-picker"><FileUp size={15} />Upload certificate<input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={uploadCertificate} /></label></div>
    {error && <p className="admin-form-error" role="alert">{error}</p>}
    <div className="admin-certificate-list">{data.certificates.map((certificate) => <article key={certificate.id}><FileUp size={15} /><span><strong>{certificate.name}</strong><small>{certificate.product} Â· {certificate.region}</small></span><time>{new Date(certificate.uploadedAt).toLocaleDateString()}</time>{certificate.dataUrl && <a href={certificate.dataUrl} download={certificate.name} aria-label={`Download ${certificate.name}`}><Download size={14} /></a>}<button type="button" aria-label={`Remove ${certificate.name}`} onClick={() => persist({ ...data, certificates: data.certificates.filter((item) => item.id !== certificate.id) }, "Certificate removed")}><Trash2 size={14} /></button></article>)}{!data.certificates.length && <p className="admin-empty-note">No certificates uploaded. Add a region specific certificate above.</p>}</div>
  </section>;
}