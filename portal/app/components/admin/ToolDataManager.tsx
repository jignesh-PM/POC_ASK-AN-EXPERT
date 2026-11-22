"use client";

import { useState, type ChangeEvent } from "react";
import { Download, FileUp, Save, Trash2 } from "@/app/components/Icon";
import { Alert, Button, EmptyState, Field, Grid, Input, SectionHeader, Select } from "@/app/components/ui";
import { REGIONS } from "@/app/lib/locale";
import { createId } from "@/app/lib/storage";
import { AdminPanel } from "./AdminPanel";
import { updateToolData, useToolData, type ToolCertificate } from "./admin-store";
import { useSavedFlash } from "./useSavedFlash";
import styles from "./ToolDataManager.module.css";

const MAX_CERTIFICATE_BYTES = 1024 * 1024;
type FactorKey = "gasFactor" | "electricityFactor";

export function ToolDataManager() {
  const data = useToolData();
  const { saved, record } = useSavedFlash();
  /** Unsaved factor edits; cleared after saving. */
  const [factors, setFactors] = useState<Partial<Record<FactorKey, string>>>({});
  const [product, setProduct] = useState("");
  const [region, setRegion] = useState<string>(REGIONS[0].value);
  const [error, setError] = useState("");

  const factor = (key: FactorKey) => factors[key] ?? data[key];

  const saveFactors = () => {
    updateToolData((current) => ({ ...current, gasFactor: factor("gasFactor"), electricityFactor: factor("electricityFactor") }));
    setFactors({});
    record("CO₂ factors updated", "Restricted tools");
  };

  const uploadCertificate = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const file = input.files?.[0];
    if (!file) return;
    if (file.size > MAX_CERTIFICATE_BYTES) {
      setError("Choose a file under 1 MB.");
      input.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const certificate: ToolCertificate = { id: createId("cert"), name: file.name, product: product.trim() || "General certificate", region, uploadedAt: new Date().toISOString(), dataUrl: String(reader.result) };
      updateToolData((current) => ({ ...current, certificates: [certificate, ...current.certificates] }));
      record("Certificate uploaded", `${certificate.name} (${certificate.region})`);
      setProduct("");
      setError("");
      input.value = "";
    };
    reader.onerror = () => setError("Couldn’t read this file. Try another.");
    reader.readAsDataURL(file);
  };

  const removeCertificate = (certificate: ToolCertificate) => {
    updateToolData((current) => ({ ...current, certificates: current.certificates.filter((item) => item.id !== certificate.id) }));
    record("Certificate removed", certificate.name);
  };

  return (
    <AdminPanel id="admin-tool-data" title="Restricted tool data" description="CO₂ factors and regional certificates." saved={saved}>
      <section className={styles.block} aria-labelledby="admin-tool-factors">
        <SectionHeader as="h3" id="admin-tool-factors" title="CO₂ factors" />
        <div className={styles.row}>
          <Field label="Natural gas factor (kg CO₂e/kWh)">
            <Input type="number" min="0" step="0.001" value={factor("gasFactor")} onChange={(event) => setFactors({ ...factors, gasFactor: event.target.value })} />
          </Field>
          <Field label="Electricity factor (kg CO₂e/kWh)">
            <Input type="number" min="0" step="0.001" value={factor("electricityFactor")} onChange={(event) => setFactors({ ...factors, electricityFactor: event.target.value })} />
          </Field>
          <Button onClick={saveFactors} leading={<Save size={16} aria-hidden="true" />}>
            Save
          </Button>
        </div>
      </section>

      <section className={styles.block} aria-labelledby="admin-tool-certificates">
        <SectionHeader as="h3" id="admin-tool-certificates" title="Regional certificates" description="PDF or image, up to 1 MB. Prototype: stored in this browser only." />
        <Grid min={200} gap={4}>
          <Field label="Product" optional>
            <Input value={product} onChange={(event) => setProduct(event.target.value)} placeholder="FireMaster duct wrap" />
          </Field>
          <Field label="Region">
            <Select value={region} onChange={(event) => setRegion(event.target.value)}>
              {REGIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Certificate file">
            <Input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={uploadCertificate} className={styles.file} />
          </Field>
        </Grid>
        {error && <Alert tone="danger">{error}</Alert>}

        {data.certificates.length ? (
          <ul className={styles.list} aria-label="Uploaded certificates">
            {data.certificates.map((certificate) => (
              <li className={styles.item} key={certificate.id}>
                <div className={styles.copy}>
                  <strong className={styles.title}>{certificate.name}</strong>
                  <span className={styles.meta}>
                    {certificate.product} · {certificate.region} ·{" "}
                    <time dateTime={certificate.uploadedAt}>{new Date(certificate.uploadedAt).toLocaleDateString()}</time>
                  </span>
                </div>
                <div className={styles.itemActions}>
                  {certificate.dataUrl && (
                    <Button href={certificate.dataUrl} download={certificate.name} variant="ghost" size="sm" iconOnly aria-label={`Download ${certificate.name}`}>
                      <Download size={16} aria-hidden="true" />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" iconOnly onClick={() => removeCertificate(certificate)} aria-label={`Remove ${certificate.name}`}>
                    <Trash2 size={16} aria-hidden="true" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon={<FileUp size={22} />} title="No certificates yet" description="Upload one above." />
        )}
      </section>
    </AdminPanel>
  );
}
