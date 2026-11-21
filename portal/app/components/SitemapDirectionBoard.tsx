"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, ChevronDown, ChevronUp, Compass, Search, Save, Trash2, X } from "lucide-react";
import { portalMap } from "../lib/project-documentation";
import styles from "./SitemapDirectionBoard.module.css";

const directionKey = "morgan-portal-direction-note";
const directionStages = [
  { name: "Now", color: "blue", detail: "Stabilize navigation, account preferences, and document journeys." },
  { name: "Next", color: "orange", detail: "Connect tools, document search, and expert requests to real services." },
  { name: "Later", color: "gray", detail: "Add analytics, workflow administration, and localized content." },
];
const mappedRouteCount = portalMap.reduce((total, section) => total + section.nodes.length, 0);
const initialVisibleRoutes = 5;

export default function SitemapDirectionBoard() {
  const [note, setNote] = useState("");
  const [savedNote, setSavedNote] = useState("");
  const [message, setMessage] = useState("");
  const [routeQuery, setRouteQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState("all");
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  const visibleSections = useMemo(() => {
    const normalizedQuery = routeQuery.trim().toLowerCase();
    return portalMap
      .filter((section) => activeGroup === "all" || section.id === activeGroup)
      .map((section) => ({
        ...section,
        nodes: normalizedQuery
          ? section.nodes.filter((node) => `${node.title} ${node.href} ${node.type}`.toLowerCase().includes(normalizedQuery))
          : section.nodes,
      }))
      .filter((section) => section.nodes.length > 0);
  }, [activeGroup, routeQuery]);
  const visibleRouteCount = visibleSections.reduce((total, section) => total + section.nodes.length, 0);

  useEffect(() => {
    const existingNote = window.localStorage.getItem(directionKey) ?? "";
    setNote(existingNote);
    setSavedNote(existingNote);
  }, []);

  const saveNote = () => {
    const nextNote = note.trim();
    if (nextNote) window.localStorage.setItem(directionKey, nextNote);
    else window.localStorage.removeItem(directionKey);
    setSavedNote(nextNote);
    setMessage(nextNote ? "Direction note saved in this browser." : "Direction note cleared.");
  };

  const clearNote = () => {
    setNote("");
    window.localStorage.removeItem(directionKey);
    setSavedNote("");
    setMessage("Direction note cleared.");
  };

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <div><p className={styles.eyebrow}>PORTAL DIRECTION BOARD</p><h2>Site map</h2><p>Use this board to see how the portal connects and to record the next direction for its evolution.</p></div>
        <span className={styles.boardStatus}><span /> Working map · {mappedRouteCount} routes</span>
      </header>

      <section className={styles.canvas} aria-label="Portal route canvas">
        <div className={styles.canvasToolbar}>
          <div className={styles.canvasTitle}><span className={styles.canvasTitleIcon}><Compass size={16} /></span><span><strong>Explore the portal map</strong><small>Choose a goal, then open any route</small></span></div>
          <label className={styles.mapSearch}><Search size={15} aria-hidden="true" /><span className={styles.visuallyHidden}>Search portal routes</span><input value={routeQuery} onChange={(event) => setRouteQuery(event.target.value)} placeholder="Find a page or route" />{routeQuery && <button type="button" onClick={() => setRouteQuery("")} aria-label="Clear route search"><X size={14} /></button>}</label>
          <span className={styles.legend}><i /> {visibleRouteCount} routes</span>
        </div>
        <div className={styles.groupFilters} role="group" aria-label="Filter route groups">
          <button type="button" className={activeGroup === "all" ? styles.activeFilter : ""} onClick={() => setActiveGroup("all")}>All areas <span>{mappedRouteCount}</span></button>
          {portalMap.map((section) => <button type="button" key={section.id} className={activeGroup === section.id ? styles.activeFilter : ""} onClick={() => setActiveGroup(section.id)}>{section.name}<span>{section.nodes.length}</span></button>)}
        </div>
        <div className={styles.canvasViewport}>
          <div className={styles.mapIntro}><div className={styles.rootNode}><span>START HERE</span><Link href="/">Portal overview <ArrowUpRight size={15} aria-hidden="true" /></Link></div><p>Follow a customer goal to its pages. Search or filter by group to find a specific destination.</p></div>
          <div className={styles.downLink} aria-hidden="true"><span /><ArrowDown size={15} /></div>
          <div className={styles.routeLanes}>
            {visibleSections.map((section) => (
              <section className={styles.routeLane} key={section.id} aria-labelledby={`route-group-${section.id}`}>
                <header><span className={styles.laneIndex}>{String(portalMap.findIndex((group) => group.id === section.id) + 1).padStart(2, "0")}</span><div><h3 id={`route-group-${section.id}`}>{section.name}</h3><p>{section.description}</p></div><span className={styles.routeCount}>{section.nodes.length}</span></header>
                <div className={styles.routeNodes}>{section.nodes.slice(0, routeQuery || expandedGroups.includes(section.id) ? section.nodes.length : initialVisibleRoutes).map((node) => <Link className={styles.routeNode} key={node.href} href={node.href}><span><small>{node.type}</small><ArrowUpRight size={14} aria-hidden="true" /></span><strong>{node.title}</strong><code>{node.href}</code></Link>)}</div>
                {!routeQuery && section.nodes.length > initialVisibleRoutes && <button className={styles.expandRoutes} type="button" aria-expanded={expandedGroups.includes(section.id)} onClick={() => setExpandedGroups((current) => current.includes(section.id) ? current.filter((id) => id !== section.id) : [...current, section.id])}>{expandedGroups.includes(section.id) ? <>Show fewer routes <ChevronUp size={14} /></> : <>View all {section.nodes.length} routes <ChevronDown size={14} /></>}</button>}
              </section>
            ))}
            {visibleSections.length === 0 && <div className={styles.noRoutes}><Search size={20} /><strong>No matching routes</strong><span>Try a different page name or route.</span><button type="button" onClick={() => { setRouteQuery(""); setActiveGroup("all"); }}>Clear filters</button></div>}
          </div>
        </div>
        <p className={styles.canvasCaption}>This is the current route map. Keep route names and ownership synchronized with the product direction.</p>
      </section>

      <section className={styles.directionSection} aria-labelledby="direction-heading">
        <div className={styles.directionHeader}><div><p className={styles.eyebrow}>EVOLUTION PLAN</p><h3 id="direction-heading">Now · Next · Later</h3></div><p>Shape the portal in small, reviewable steps.</p></div>
        <div className={styles.stageGrid}>{directionStages.map((stage) => <article className={`${styles.stage} ${styles[stage.color]}`} key={stage.name}><span>{stage.name}</span><p>{stage.detail}</p></article>)}</div>
      </section>

      <section className={styles.noteBoard} aria-labelledby="note-heading">
        <div className={styles.noteIntro}><p className={styles.eyebrow}>TEAM WORKSPACE</p><h3 id="note-heading">Direction note</h3><p>Capture a short decision or next step alongside the route map. The note stays in this browser for the demo.</p></div>
        <div className={styles.noteEditor}><label htmlFor="direction-note">Portal direction</label><textarea id="direction-note" value={note} onChange={(event) => { setNote(event.target.value); setMessage(""); }} placeholder="Example: connect document search to the approved content source…" rows={3} /><div><span aria-live="polite">{message || (savedNote ? "Saved locally" : "No note saved yet")}</span><button type="button" className={styles.clearButton} onClick={clearNote} disabled={!note && !savedNote}><Trash2 size={14} /> Clear</button><button type="button" className={styles.saveButton} onClick={saveNote}><Save size={14} /> Save note</button></div></div>
      </section>
    </main>
  );
}
