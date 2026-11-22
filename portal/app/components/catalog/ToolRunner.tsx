"use client";

import { useState } from "react";
import { ArrowRight, ArrowUpRight, BadgeCheck, Calculator, Download, Search, UserRound } from "@/app/components/Icon";
import { Alert, Badge, Button, Card, EmptyState, Field, Input, SearchInput, SectionHeader, Select, Stack } from "@/app/components/ui";
import { qualityCertificatesUrl } from "@/app/lib/compliance-data";
import { REGIONS } from "@/app/lib/locale";
import { useProfileCompletion } from "@/app/lib/profile-completion";
import { isStaff, setRegion, useAdminSettings, useRegion, useRole } from "@/app/lib/session";
import { STORAGE_KEYS, useHydrated, useStoredJSON } from "@/app/lib/storage";
import { matchesQuery } from "./catalog-data";
import styles from "./ToolRunner.module.css";

/** Data maintained by admins in the restricted-tools manager. */
type Certificate = { id: string; name: string; product: string; region: string; uploadedAt: string; dataUrl?: string };
type ToolData = { gasFactor?: string; electricityFactor?: string; certificates?: Certificate[] };

const NO_TOOL_DATA: ToolData = {};
const ENERGY_SOURCES = {
  "natural-gas": { label: "Natural gas", fallbackFactor: 0.202, key: "gasFactor" },
  electricity: { label: "Electricity", fallbackFactor: 0.4, key: "electricityFactor" },
} as const;
type EnergySource = keyof typeof ENERGY_SOURCES;

/** Renders the interactive part of a tool page, behind the profile gate when the admin requires it. */
export function ToolRunner({ slug, restricted }: { slug: string; restricted: boolean }) {
  const hydrated = useHydrated();
  const role = useRole();
  const { requireProfile } = useAdminSettings();
  const profile = useProfileCompletion();

  // Stored settings are only known in the browser; avoid flashing the tool before the gate is decided.
  if (restricted && !hydrated) {
    return (
      <Card padding="lg" aria-busy="true">
        <p className={styles.muted}>Loading tool…</p>
      </Card>
    );
  }

  const allowed = !restricted || !requireProfile || isStaff(role) || profile.missing.length === 0;
  if (!allowed) return <ProfileGate missing={profile.missing.length} />;

  if (slug === "pfp-certificates") return <CertificateBrowser />;
  if (slug === "co2-estimation") return <Co2Calculator />;
  return <ExternalToolNotice staff={isStaff(role)} />;
}

function ProfileGate({ missing }: { missing: number }) {
  return (
    <Card padding="lg">
      <EmptyState
        icon={<UserRound size={22} aria-hidden="true" />}
        title="Complete your profile to continue"
        description={`This restricted tool needs your organisation and contact details (${missing} ${missing === 1 ? "field" : "fields"} left). Your question and product context stay available.`}
        action={
          <Button href="/profile" variant="accent" trailing={<ArrowRight size={16} aria-hidden="true" />}>
            Complete your profile
          </Button>
        }
      />
    </Card>
  );
}

function CertificateBrowser() {
  const region = useRegion();
  const [query, setQuery] = useState("");
  const { certificates = [] } = useStoredJSON(STORAGE_KEYS.toolData, NO_TOOL_DATA);
  const results = certificates.filter((certificate) => (certificate.region === region || certificate.region === "Global") && matchesQuery(query, certificate.product, certificate.name));

  return (
    <Stack as="section" gap={4} aria-labelledby="certificate-results-title">
      <SectionHeader id="certificate-results-title" title="Regional certificates" description="Search certificates published for your selected region." />
      <div className={styles.filters}>
        <Field label="Search product">
          <SearchInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="e.g. FireMaster duct wrap" />
        </Field>
        <Field label="Region">
          <Select value={region} onChange={(event) => setRegion(event.target.value)}>
            {REGIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.short}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      {results.length ? (
        <Stack as="ul" gap={3}>
          {results.map((certificate) => (
            <Card as="li" padding="sm" key={certificate.id}>
              <div className={styles.record}>
                <div className={styles.recordCopy}>
                  <strong className={styles.recordTitle}>{certificate.product}</strong>
                  <span className={styles.muted}>{certificate.name}</span>
                </div>
                <Badge>{certificate.region}</Badge>
                {certificate.dataUrl && (
                  <Button href={certificate.dataUrl} download={certificate.name} variant="secondary" size="sm" leading={<Download size={15} aria-hidden="true" />} aria-label={`Download ${certificate.name}`}>
                    Download
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </Stack>
      ) : (
        <EmptyState
          icon={<Search size={22} aria-hidden="true" />}
          title="No certificates found"
          description="No portal certificates match this region and search. Morgan's published certificates may cover your product."
          action={
            <div className={styles.actions}>
              {query && (
                <Button variant="secondary" onClick={() => setQuery("")}>
                  Clear search
                </Button>
              )}
              <Button href={qualityCertificatesUrl} external variant="link" trailing={<ArrowUpRight size={15} aria-hidden="true" />}>
                Morgan&apos;s published certificates
              </Button>
            </div>
          }
        />
      )}
    </Stack>
  );
}

function Co2Calculator() {
  const toolData = useStoredJSON(STORAGE_KEYS.toolData, NO_TOOL_DATA);
  const [energy, setEnergy] = useState<EnergySource>("natural-gas");
  const [consumption, setConsumption] = useState("10000");
  const [calculated, setCalculated] = useState(false);

  const source = ENERGY_SOURCES[energy];
  const factor = Number(toolData[source.key]) || source.fallbackFactor;
  const tonnes = (Math.max(0, Number(consumption) || 0) * factor) / 1000;

  return (
    <Card as="form" padding="lg" aria-labelledby="co2-title" onSubmit={(event) => { event.preventDefault(); setCalculated(true); }}>
      <div className={styles.calcHeading}>
        <div>
          <h2 id="co2-title" className={styles.calcTitle}>
            Estimate annual energy emissions
          </h2>
          <p className={styles.muted}>Uses the emission factors maintained by Morgan administrators.</p>
        </div>
      </div>
      <div className={styles.filters}>
        <Field label="Energy source">
          <Select
            value={energy}
            onChange={(event) => {
              setEnergy(event.target.value as EnergySource);
              setCalculated(false);
            }}
          >
            {Object.entries(ENERGY_SOURCES).map(([value, item]) => (
              <option key={value} value={value}>
                {item.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Annual consumption (kWh)">
          <Input
            type="number"
            min="0"
            inputMode="decimal"
            value={consumption}
            onChange={(event) => {
              setConsumption(event.target.value);
              setCalculated(false);
            }}
          />
        </Field>
      </div>
      <div>
        <Button type="submit" leading={<Calculator size={16} aria-hidden="true" />}>
          Calculate estimate
        </Button>
      </div>
      <div aria-live="polite">
        {calculated && (
          <Alert tone="success" icon={<BadgeCheck size={18} aria-hidden="true" />}>
            <p>
              Estimated emissions: <strong>{tonnes.toLocaleString(undefined, { maximumFractionDigits: 2 })} tonnes CO₂e per year</strong>
            </p>
            <p className={styles.small}>
              Based on the current Morgan factor for {source.label.toLowerCase()}: {factor} kg CO₂e/kWh.
            </p>
          </Alert>
        )}
      </div>
    </Card>
  );
}

function ExternalToolNotice({ staff }: { staff: boolean }) {
  return (
    <Card padding="lg">
      <p>This tool is available in the portal prototype. Contact your Morgan representative or ask an expert for application-specific guidance.</p>
      {staff && <Badge tone="brand">Expert preview access is enabled</Badge>}
      <div className={styles.actions}>
        <Button href="/questions?mode=expert" variant="accent" trailing={<ArrowRight size={16} aria-hidden="true" />}>
          Ask a Morgan expert
        </Button>
        <Button href="/tools" variant="secondary">
          Browse other tools
        </Button>
      </div>
    </Card>
  );
}
