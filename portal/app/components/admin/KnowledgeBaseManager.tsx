"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight, Eye, EyeOff, FileText, Plus, Trash2 } from "@/app/components/Icon";
import { Alert, Badge, Button, EmptyState, Field, Grid, IconTile, Input, Select, Textarea } from "@/app/components/ui";
import { useAdminKnowledgeBase, writeAdminKnowledgeBase, type AdminKnowledgeResource } from "@/app/lib/admin-knowledge-base";
import { categories } from "@/app/lib/mock-data";
import type { IndexedResource } from "@/app/lib/site-index";
import { createId } from "@/app/lib/storage";
import { AdminPanel } from "./AdminPanel";
import { useSavedFlash } from "./useSavedFlash";
import styles from "./KnowledgeBaseManager.module.css";

const DOCUMENT_TYPES: IndexedResource["type"][] = ["Datasheet", "SDS", "Installation manual", "Technical paper", "Certificate"];
const EMPTY_DRAFT = { title: "", summary: "", url: "", category: categories[0].name, type: "Technical paper" as IndexedResource["type"] };

/** Returns the normalised URL, or an error message when it is not a valid HTTPS link. */
function validateSourceUrl(value: string): { url: string } | { error: string } {
  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === "https:" ? { url: parsed.href } : { error: "Only secure HTTPS source links are allowed." };
  } catch {
    return { error: "Enter a valid HTTPS source URL." };
  }
}

export function KnowledgeBaseManager() {
  const resources = useAdminKnowledgeBase();
  const { saved, record } = useSavedFlash();
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [error, setError] = useState("");

  const commit = (next: AdminKnowledgeResource[], action: string, detail: string) => {
    writeAdminKnowledgeBase(next);
    record(action, detail);
  };

  const addResource = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = draft.title.trim();
    const summary = draft.summary.trim();
    if (!title || !summary) return setError("Add a title and a short summary.");
    const checked = validateSourceUrl(draft.url);
    if ("error" in checked) return setError(checked.error);
    const entry: AdminKnowledgeResource = {
      id: createId("admin"),
      title,
      summary,
      url: checked.url,
      category: draft.category,
      type: draft.type,
      locale: "en-gb",
      keywords: `${title} ${summary} ${draft.category}`.toLowerCase().split(/\s+/).filter(Boolean),
      visible: true,
      uploadedAt: new Date().toISOString(),
    };
    commit([entry, ...resources], "Knowledge item added", entry.title);
    setDraft(EMPTY_DRAFT);
    setError("");
  };

  const toggle = (item: AdminKnowledgeResource) =>
    commit(
      resources.map((resource) => (resource.id === item.id ? { ...resource, visible: !resource.visible } : resource)),
      item.visible ? "Knowledge item hidden" : "Knowledge item published",
      item.title,
    );

  return (
    <AdminPanel
      id="admin-knowledge-base"
      eyebrow="Knowledge base"
      title="Knowledge base sources"
      description="Add technical source links used in the customer document library and question recommendations."
      saved={saved}
    >
      <form className={styles.form} onSubmit={addResource} noValidate>
        <Grid min={220} gap={4}>
          <Field label="Document title">
            <Input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="Technical guide title" required />
          </Field>
          <Field label="Secure source URL" hint="Must start with https://">
            <Input type="url" inputMode="url" value={draft.url} onChange={(event) => setDraft({ ...draft, url: event.target.value })} placeholder="https://www.morganthermalceramics.com/…" required />
          </Field>
          <Field label="Product line">
            <Select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}>
              {categories.map((item) => (
                <option key={item.slug}>{item.name}</option>
              ))}
            </Select>
          </Field>
          <Field label="Document type">
            <Select value={draft.type} onChange={(event) => setDraft({ ...draft, type: event.target.value as IndexedResource["type"] })}>
              {DOCUMENT_TYPES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </Select>
          </Field>
        </Grid>
        <Field label="Short summary">
          <Textarea value={draft.summary} onChange={(event) => setDraft({ ...draft, summary: event.target.value })} rows={2} placeholder="A concise description to help search and recommendations." required />
        </Field>
        {error && <Alert tone="danger">{error}</Alert>}
        <div className={styles.actions}>
          <Button type="submit" leading={<Plus size={16} aria-hidden="true" />}>
            Add source
          </Button>
        </div>
      </form>

      {resources.length ? (
        <ul className={styles.list} aria-label="Added sources">
          {resources.map((resource) => (
            <li className={styles.item} key={resource.id}>
              <IconTile size="sm">
                <FileText size={16} />
              </IconTile>
              <div className={styles.copy}>
                <strong className={styles.title}>{resource.title}</strong>
                <span className={styles.meta}>
                  {resource.category} · {resource.type}
                </span>
              </div>
              <Badge tone={resource.visible ? "success" : "neutral"}>{resource.visible ? "Published" : "Hidden"}</Badge>
              <div className={styles.itemActions}>
                <Button href={resource.url} external variant="ghost" size="sm" iconOnly aria-label={`Open ${resource.title}`}>
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Button>
                <Button variant="ghost" size="sm" iconOnly onClick={() => toggle(resource)} aria-label={`${resource.visible ? "Hide" : "Publish"} ${resource.title}`}>
                  {resource.visible ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconOnly
                  onClick={() => commit(resources.filter((item) => item.id !== resource.id), "Knowledge item removed", resource.title)}
                  aria-label={`Remove ${resource.title}`}
                >
                  <Trash2 size={16} aria-hidden="true" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState icon={<FileText size={22} />} title="No additional sources yet" description="Sources you add here appear in the document library and recommendations." />
      )}
    </AdminPanel>
  );
}
