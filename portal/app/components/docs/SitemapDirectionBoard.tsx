"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, ChevronDown, ChevronUp, Compass, Save, Search, Trash2 } from "@/app/components/Icon";
import { Badge, Button, Card, EmptyState, Field, Grid, IconTile, SearchInput, SectionHeader, Stack, Textarea, cx } from "@/app/components/ui";
import { portalMap } from "@/app/lib/project-documentation";
import { STORAGE_KEYS, useStoredString, writeString } from "@/app/lib/storage";
import styles from "./SitemapDirectionBoard.module.css";

const mappedRouteCount = portalMap.reduce((total, section) => total + section.nodes.length, 0);
const INITIAL_VISIBLE_ROUTES = 5;

const STAGES = [
  { name: "Now", tone: "brand", detail: "Stabilise navigation, account preferences and document journeys." },
  { name: "Next", tone: "accent", detail: "Connect tools, document search and expert requests to real services." },
  { name: "Later", tone: "neutral", detail: "Add shared analytics, workflow administration and localised content." },
] as const;

/** Interactive portal route map, the Now/Next/Later plan and a locally saved direction note. */
export default function SitemapDirectionBoard() {
  return (
    <>
      <RouteExplorer />
      <section aria-labelledby="direction-heading">
        <Stack gap={4}>
          <SectionHeader id="direction-heading" eyebrow="Evolution plan" title="Now · Next · Later" description="Shape the portal in small, reviewable steps." />
          <Grid min={220} gap={4} as="ul">
            {STAGES.map((stage) => (
              <Card as="li" key={stage.name} className={cx(styles.stage, styles[`stage-${stage.tone}`])}>
                <Badge tone={stage.tone}>{stage.name}</Badge>
                <p className={styles.text}>{stage.detail}</p>
              </Card>
            ))}
          </Grid>
        </Stack>
      </section>
      <DirectionNote />
    </>
  );
}

function RouteExplorer() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("all");
  const [expanded, setExpanded] = useState<string[]>([]);

  const normalized = query.trim().toLowerCase();
  const sections = portalMap
    .filter((section) => group === "all" || section.id === group)
    .map((section) => ({
      ...section,
      index: portalMap.indexOf(section) + 1,
      nodes: normalized ? section.nodes.filter((node) => `${node.title} ${node.href} ${node.type}`.toLowerCase().includes(normalized)) : section.nodes,
    }))
    .filter((section) => section.nodes.length > 0);
  const visibleCount = sections.reduce((total, section) => total + section.nodes.length, 0);

  const toggleExpanded = (id: string) => setExpanded((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  const filters = [{ id: "all", name: "All areas", count: mappedRouteCount }, ...portalMap.map((section) => ({ id: section.id, name: section.name, count: section.nodes.length }))];

  return (
    <Card as="section" padding="lg" aria-labelledby="route-map-heading" className={styles.explorer}>
      <SectionHeader
        id="route-map-heading"
        eyebrow="Route map"
        title="Explore the portal map"
        description="Choose a goal, then open any route."
        actions={
          <IconTile size="sm">
            <Compass size={18} />
          </IconTile>
        }
      />

      <div className={styles.toolbar}>
        <Field label="Search portal routes" hideLabel className={styles.search}>
          <SearchInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a page or route" />
        </Field>
        <span className={styles.count} role="status">
          {visibleCount} {visibleCount === 1 ? "route" : "routes"}
        </span>
      </div>

      <div className={styles.filters} role="group" aria-label="Filter route groups">
        {filters.map((filter) => (
          <button key={filter.id} type="button" className={styles.filter} aria-pressed={group === filter.id} onClick={() => setGroup(filter.id)}>
            {filter.name}
            <span className={styles.filterCount}>{filter.count}</span>
          </button>
        ))}
      </div>

      {sections.length ? (
        <Grid min={280} gap={4}>
          {sections.map((section) => {
            const showAll = Boolean(normalized) || expanded.includes(section.id);
            const nodes = showAll ? section.nodes : section.nodes.slice(0, INITIAL_VISIBLE_ROUTES);
            const listId = `route-list-${section.id}`;
            return (
              <Card as="section" tone="muted" key={section.id} aria-labelledby={`route-group-${section.id}`}>
                <div className={styles.laneHeader}>
                  <span className={styles.laneIndex} aria-hidden="true">
                    {String(section.index).padStart(2, "0")}
                  </span>
                  <div className={styles.laneCopy}>
                    <h3 id={`route-group-${section.id}`} className={styles.laneTitle}>
                      {section.name}
                    </h3>
                    <p className={styles.text}>{section.description}</p>
                  </div>
                  <Badge tone="brand">{section.nodes.length}</Badge>
                </div>
                <ul className={styles.nodes} id={listId}>
                  {nodes.map((node) => (
                    <li key={node.href}>
                      <Link className={styles.node} href={node.href}>
                        <span className={styles.nodeMeta}>
                          {node.type}
                          <ArrowUpRight size={14} aria-hidden="true" />
                        </span>
                        <strong className={styles.nodeTitle}>{node.title}</strong>
                        <code className={styles.nodeHref}>{node.href}</code>
                      </Link>
                    </li>
                  ))}
                </ul>
                {!normalized && section.nodes.length > INITIAL_VISIBLE_ROUTES && (
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-expanded={showAll}
                    aria-controls={listId}
                    onClick={() => toggleExpanded(section.id)}
                    trailing={showAll ? <ChevronUp size={14} aria-hidden="true" /> : <ChevronDown size={14} aria-hidden="true" />}
                  >
                    {showAll ? "Show fewer routes" : `View all ${section.nodes.length} routes`}
                  </Button>
                )}
              </Card>
            );
          })}
        </Grid>
      ) : (
        <EmptyState
          icon={<Search size={22} />}
          title="No matching routes"
          description="Try a different page name or route."
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setQuery("");
                setGroup("all");
              }}
            >
              Clear filters
            </Button>
          }
        />
      )}
      <p className={styles.caption}>Keep route names and ownership synchronised with the product direction.</p>
    </Card>
  );
}

function DirectionNote() {
  const savedNote = useStoredString(STORAGE_KEYS.directionNote) ?? "";
  /** Unsaved edits; `null` means the editor shows the saved note. */
  const [draft, setDraft] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const value = draft ?? savedNote;

  const save = () => {
    const next = value.trim();
    writeString(STORAGE_KEYS.directionNote, next || null);
    setDraft(null);
    setMessage(next ? "Direction note saved in this browser." : "Direction note cleared.");
  };

  const clear = () => {
    writeString(STORAGE_KEYS.directionNote, null);
    setDraft(null);
    setMessage("Direction note cleared.");
  };

  return (
    <Card as="section" padding="lg" aria-labelledby="note-heading">
      <SectionHeader
        id="note-heading"
        eyebrow="Team workspace"
        title="Direction note"
        description="Capture a short decision or next step alongside the route map. The note stays in this browser for the demo."
      />
      <Field label="Portal direction" hint={<span aria-live="polite">{message || (savedNote ? "Saved locally." : "No note saved yet.")}</span>}>
        <Textarea
          value={value}
          onChange={(event) => {
            setDraft(event.target.value);
            setMessage("");
          }}
          placeholder="Example: connect document search to the approved content source…"
          rows={3}
        />
      </Field>
      <div className={styles.noteActions}>
        <Button variant="ghost" onClick={clear} disabled={!value && !savedNote} leading={<Trash2 size={16} aria-hidden="true" />}>
          Clear
        </Button>
        <Button onClick={save} disabled={draft === null} leading={<Save size={16} aria-hidden="true" />}>
          Save note
        </Button>
      </div>
    </Card>
  );
}
