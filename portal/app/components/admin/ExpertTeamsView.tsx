"use client";

import { useState } from "react";
import { Globe, Save } from "@/app/components/Icon";
import { Badge, Button, Card, Field, Grid, Input, SectionHeader, Select } from "@/app/components/ui";
import { REGIONS } from "@/app/lib/locale";
import { categories } from "@/app/lib/mock-data";
import { AdminPanel } from "./AdminPanel";
import { DEFAULT_ROUTE, saveTeamRoute, useTeamRouting, type TeamRoute } from "./admin-store";
import { useSavedFlash } from "./useSavedFlash";
import styles from "./ExpertTeamsView.module.css";

const TEXT_FIELDS: { key: "manager" | "members" | "backup" | "hours"; label: string; placeholder?: string }[] = [
  { key: "manager", label: "Product manager", placeholder: "Name or Morgan email" },
  { key: "members", label: "Team members", placeholder: "Separate experts with commas" },
  { key: "backup", label: "Backup expert", placeholder: "Name or Morgan email" },
  { key: "hours", label: "Working hours" },
];

export function ExpertTeamsView() {
  const stored = useTeamRouting();
  const { saved, record } = useSavedFlash();
  /** Unsaved edits per product line, layered over the stored routing. */
  const [drafts, setDrafts] = useState<Record<string, Partial<TeamRoute>>>({});

  const routeFor = (slug: string): TeamRoute => ({ ...DEFAULT_ROUTE, ...stored[slug], ...drafts[slug] });
  const edit = (slug: string, update: Partial<TeamRoute>) => setDrafts((current) => ({ ...current, [slug]: { ...current[slug], ...update } }));

  const save = (slug: string, name: string) => {
    saveTeamRoute(slug, routeFor(slug));
    setDrafts((current) => {
      const next = { ...current };
      delete next[slug];
      return next;
    });
    record("Expert routing updated", name);
  };

  return (
    <AdminPanel id="admin-expert-routing" title="Product line ownership and routing" description="Questions for each product line are routed to the team saved here." saved={saved}>
      <div className={styles.list}>
        {categories.map((category) => {
          const route = routeFor(category.slug);
          const headingId = `route-${category.slug}`;
          const dirty = Boolean(drafts[category.slug]);
          return (
            <Card as="section" tone="muted" key={category.slug} aria-labelledby={headingId}>
              <SectionHeader
                as="h3"
                id={headingId}
                eyebrow="Product line"
                title={category.name}
                actions={
                  <Badge tone="brand">
                    <Globe size={14} aria-hidden="true" />
                    {route.region}
                  </Badge>
                }
              />
              <Grid min={220} gap={4}>
                {TEXT_FIELDS.map((field) => (
                  <Field label={field.label} key={field.key}>
                    <Input value={route[field.key]} placeholder={field.placeholder} onChange={(event) => edit(category.slug, { [field.key]: event.target.value })} />
                  </Field>
                ))}
                <Field label="Response target (hours)">
                  <Input type="number" min={1} max={240} value={route.responseHours} onChange={(event) => edit(category.slug, { responseHours: Number(event.target.value) })} />
                </Field>
                <Field label="Routing region">
                  <Select value={route.region} onChange={(event) => edit(category.slug, { region: event.target.value })}>
                    <option value="Global">Global</option>
                    {REGIONS.map((region) => (
                      <option key={region.value} value={region.value}>
                        {region.label}
                      </option>
                    ))}
                  </Select>
                </Field>
              </Grid>
              <div className={styles.actions}>
                {dirty && <span className={styles.unsaved}>Unsaved changes</span>}
                <Button onClick={() => save(category.slug, category.name)} leading={<Save size={16} aria-hidden="true" />}>
                  Save routing
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </AdminPanel>
  );
}
