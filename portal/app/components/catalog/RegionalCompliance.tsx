"use client";

import { ArrowUpRight, BadgeCheck, MapPin } from "@/app/components/Icon";
import { Badge, Button, Card, EmptyState, Field, Grid, IconTile, SectionHeader, Select, Stack } from "@/app/components/ui";
import { useCatalogSettings } from "@/app/lib/catalog-settings";
import { morganLocationsUrl, qualityCertificatesUrl, regionalCertifications } from "@/app/lib/compliance-data";
import { REGIONS } from "@/app/lib/locale";
import { setRegion, useRegion } from "@/app/lib/session";
import styles from "./RegionalCompliance.module.css";

/** ISO certifications for Morgan locations in the visitor's region. Shares the region preference with the rest of the portal. */
export function RegionalCompliance() {
  const region = useRegion();
  const { hiddenCertificationIds } = useCatalogSettings();
  const selected = regionalCertifications[region] ?? regionalCertifications.EMEA;
  const certifications = selected.certifications.filter((cert) => !hiddenCertificationIds.includes(`${region}:${cert.id}`));

  return (
    <Stack as="section" gap={4} aria-labelledby="regional-compliance-title">
      <SectionHeader
        id="regional-compliance-title"
        eyebrow="Quality & compliance"
        title="Certified management systems"
        actions={
          <Field label="Region" className={styles.regionField}>
            <Select value={region} onChange={(event) => setRegion(event.target.value)}>
              {REGIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.short}
                </option>
              ))}
            </Select>
          </Field>
        }
      />
      <p className={styles.caption}>
        Certifications published for Morgan locations in <strong>{selected.label}</strong>.
      </p>

      {certifications.length ? (
        <Grid as="ul" min={260}>
          {certifications.map((cert) => (
            <Card as="li" key={cert.id}>
              <div className={styles.certTop}>
                <IconTile tone="success">
                  <BadgeCheck size={20} aria-hidden="true" />
                </IconTile>
                <Badge tone="success">
                  {cert.locations.length} {cert.locations.length === 1 ? "location" : "locations"}
                </Badge>
              </div>
              <h3 className={styles.standard}>{cert.standard}</h3>
              <p className={styles.name}>{cert.name}</p>
              <details className={styles.details}>
                <summary className={styles.summary}>View certified locations</summary>
                <ul className={styles.locations}>
                  {cert.locations.map((location) => (
                    <li key={location}>{location}</li>
                  ))}
                </ul>
              </details>
            </Card>
          ))}
        </Grid>
      ) : (
        <EmptyState
          icon={<MapPin size={22} aria-hidden="true" />}
          title="No regional certificates listed"
          description={`No region-specific ISO certificates are listed for ${selected.label} in the current source index.`}
          action={
            <Button href={morganLocationsUrl} external variant="secondary" trailing={<ArrowUpRight size={15} aria-hidden="true" />}>
              Explore Morgan locations
            </Button>
          }
        />
      )}

      <div className={styles.footer}>
        <p className={styles.caption}>Certificate coverage follows Morgan&apos;s published quality index.</p>
        <div className={styles.links}>
          <Button href={qualityCertificatesUrl} external variant="link" size="sm" trailing={<ArrowUpRight size={14} aria-hidden="true" />}>
            View all quality certificates
          </Button>
          <Button href={morganLocationsUrl} external variant="link" size="sm" trailing={<ArrowUpRight size={14} aria-hidden="true" />}>
            Our locations
          </Button>
        </div>
      </div>
    </Stack>
  );
}
