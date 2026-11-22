"use client";

import { useState } from "react";
import { ArrowUpRight, RefreshCw } from "@/app/components/Icon";
import { Alert, Button, Field, Grid, Input, SectionHeader, Stack, Stat, Tabs } from "@/app/components/ui";
import { readCatalogSettings, toggleHidden, useCatalogSettings, writeCatalogSettings } from "@/app/lib/catalog-settings";
import { productMasters } from "@/app/lib/mock-data";
import { officialSiteIndex } from "@/app/lib/site-index";
import { AdminPanel } from "./AdminPanel";
import { VisibilityList, VisibilityRow } from "./VisibilityList";
import { useSavedFlash } from "./useSavedFlash";
import styles from "./IndexedCatalogManager.module.css";

type CatalogTab = "products" | "documents";

const TABS = [
  { id: "products" as const, label: "Products & systems" },
  { id: "documents" as const, label: "Documents" },
];

const allProducts = productMasters.flatMap((master) => master.subcategories);

/**
 * Team input that saves on blur. Keyed by the stored value so it resets when the
 * saved team changes elsewhere.
 */
function TeamInput({ label, value, placeholder, hint, onSave }: { label: string; value: string; placeholder?: string; hint?: string; onSave: (team: string) => void }) {
  return (
    <Field label={label} hint={hint} className={styles.teamField}>
      <Input
        key={value}
        defaultValue={value}
        placeholder={placeholder}
        onBlur={(event) => {
          const next = event.target.value.trim();
          if (next !== value) onSave(next);
        }}
      />
    </Field>
  );
}

export function IndexedCatalogManager() {
  const settings = useCatalogSettings();
  const { saved, record } = useSavedFlash();
  const [tab, setTab] = useState<CatalogTab>("products");

  const visibleProducts = allProducts.filter((product) => !settings.hiddenProductIds.includes(product.id)).length;
  const visibleDocuments = officialSiteIndex.filter((resource) => !settings.hiddenDocumentIds.includes(resource.id)).length;

  const setTeam = (id: string, name: string, team: string) => {
    const current = readCatalogSettings();
    writeCatalogSettings({ ...current, expertTeams: { ...current.expertTeams, [id]: team } });
    record("Expert team mapping updated", name);
  };

  const toggle = (list: "hiddenProductIds" | "hiddenDocumentIds", id: string, name: string, visible: boolean) => {
    toggleHidden(list, id);
    record(visible ? "Catalog record hidden" : "Catalog record published", name);
  };

  return (
    <AdminPanel id="admin-index-title" title="Indexed product & document data" description="Review indexed records and choose what visitors and customers can see." saved={saved}>
      <Alert icon={<RefreshCw size={18} aria-hidden="true" />}>
        <strong>Source website: </strong>
        <a className={styles.inlineLink} href="https://www.morganthermalceramics.com/" target="_blank" rel="noreferrer">
          morganthermalceramics.com
        </a>
        . Live indexing is not connected in this prototype; the catalog is seeded with official source links.
      </Alert>

      <Grid min={180} gap={3}>
        <Stat label="Visible product systems" value={visibleProducts} hint={`of ${allProducts.length}`} />
        <Stat label="Visible documents" value={visibleDocuments} hint={`of ${officialSiteIndex.length}`} />
        <Stat label="Hidden records" value={settings.hiddenProductIds.length + settings.hiddenDocumentIds.length} />
      </Grid>

      <Tabs items={TABS} value={tab} onChange={setTab} label="Indexed data type" />

      <div role="tabpanel" aria-label={TABS.find((item) => item.id === tab)?.label} tabIndex={0} className={styles.panel}>
        {tab === "products" ? (
          <Stack gap={6}>
            {productMasters.map((master) => (
              <section key={master.id} aria-labelledby={`index-${master.id}`} className={styles.group}>
                <SectionHeader as="h3" id={`index-${master.id}`} title={master.name} />
                <TeamInput label={`Default product manager / team for ${master.name}`} value={settings.expertTeams[master.id] ?? ""} placeholder="Morgan product team" hint="Team fields save when you leave them." onSave={(team) => setTeam(master.id, master.name, team)} />
                <VisibilityList label={`${master.name} products`}>
                  {master.subcategories.map((product) => {
                    const visible = !settings.hiddenProductIds.includes(product.id);
                    return (
                      <VisibilityRow
                        key={product.id}
                        title={product.name}
                        name={product.name}
                        description={product.description}
                        visible={visible}
                        onToggle={() => toggle("hiddenProductIds", product.id, product.name, visible)}
                      >
                        <TeamInput label="Product manager / team" value={settings.expertTeams[product.id] ?? settings.expertTeams[master.id] ?? ""} onSave={(team) => setTeam(product.id, product.name, team)} />
                        <Button href={product.url} external variant="link" size="sm" trailing={<ArrowUpRight size={14} aria-hidden="true" />}>
                          Official product page
                        </Button>
                      </VisibilityRow>
                    );
                  })}
                </VisibilityList>
              </section>
            ))}
          </Stack>
        ) : (
          <VisibilityList label="Indexed documents">
            {officialSiteIndex.map((resource) => {
              const visible = !settings.hiddenDocumentIds.includes(resource.id);
              return (
                <VisibilityRow
                  key={resource.id}
                  title={resource.title}
                  name={resource.title}
                  description={`${resource.type} · ${resource.category} — ${resource.summary}`}
                  visible={visible}
                  onToggle={() => toggle("hiddenDocumentIds", resource.id, resource.title, visible)}
                >
                  <Button href={resource.url} external variant="link" size="sm" trailing={<ArrowUpRight size={14} aria-hidden="true" />}>
                    Official source
                  </Button>
                </VisibilityRow>
              );
            })}
          </VisibilityList>
        )}
      </div>
    </AdminPanel>
  );
}
