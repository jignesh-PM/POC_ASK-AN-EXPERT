"use client";

import { ArrowUpRight, BadgeCheck } from "@/app/components/Icon";
import { Button, EmptyState, SectionHeader, Stack } from "@/app/components/ui";
import { toggleHidden, useCatalogSettings } from "@/app/lib/catalog-settings";
import { qualityCertificatesUrl, regionalCertifications } from "@/app/lib/compliance-data";
import { AdminPanel } from "./AdminPanel";
import { VisibilityList, VisibilityRow } from "./VisibilityList";
import { useSavedFlash } from "./useSavedFlash";

/** ISO certification visibility per region (shown on the customer home page). */
export function ComplianceManager() {
  const { hiddenCertificationIds } = useCatalogSettings();
  const { saved, record } = useSavedFlash();

  return (
    <AdminPanel
      id="admin-compliance"
      title="ISO certifications"
      description="Choose which certifications show on the home page."
      saved={saved}
      actions={
        <Button href={qualityCertificatesUrl} external variant="secondary" size="sm" trailing={<ArrowUpRight size={14} aria-hidden="true" />}>
          View certificates
        </Button>
      }
    >
      <Stack gap={6}>
        {Object.entries(regionalCertifications).map(([region, data]) => {
          const headingId = `compliance-${region.replace(/\s+/g, "-")}`;
          return (
            <section key={region} aria-labelledby={headingId}>
              <Stack gap={3}>
                <SectionHeader as="h3" id={headingId} title={data.label} description={`Source: ${data.sourceRegion}`} />
                {data.certifications.length ? (
                  <VisibilityList label={`${data.label} certifications`}>
                    {data.certifications.map((cert) => {
                      const key = `${region}:${cert.id}`;
                      const visible = !hiddenCertificationIds.includes(key);
                      return (
                        <VisibilityRow
                          key={key}
                          title={cert.standard}
                          name={`${cert.standard} for ${data.label}`}
                          description={`${cert.name} · ${cert.locations.length} locations`}
                          visible={visible}
                          onToggle={() => {
                            toggleHidden("hiddenCertificationIds", key);
                            record("Certification visibility changed", `${cert.standard} · ${data.label} ${visible ? "hidden" : "shown"}`);
                          }}
                        />
                      );
                    })}
                  </VisibilityList>
                ) : (
                  <EmptyState icon={<BadgeCheck size={22} />} title="No certificates listed" description="None published for this region." />
                )}
              </Stack>
            </section>
          );
        })}
      </Stack>
    </AdminPanel>
  );
}
