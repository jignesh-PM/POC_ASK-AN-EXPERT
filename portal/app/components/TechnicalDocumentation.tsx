"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, BookOpenText, Check, ClipboardList, Clock3, Coins, Palette, RotateCcw, Search, Sparkles, Type, Workflow, Zap } from "lucide-react";
import {
  designTokens,
  estimateAssumptions,
  initialFeatureTracker,
  portalFeatures,
  releaseHistory,
  technologyStack,
  typographyScale,
} from "../lib/project-documentation";
import styles from "./TechnicalDocumentation.module.css";

const tabs = [
  { id: "overview", label: "Overview", icon: BookOpenText },
  { id: "design", label: "Design system", icon: Palette },
  { id: "typography", label: "Typography", icon: Type },
  { id: "technology", label: "Technology", icon: Workflow },
  { id: "features", label: "Portal features", icon: ArrowUpRight },
  { id: "tracker", label: "Effort & scope", icon: ClipboardList },
  { id: "releases", label: "Version history", icon: RotateCcw },
] as const;

type DocumentationTab = (typeof tabs)[number]["id"];
const dynamicCount = portalFeatures.filter((feature) => feature.behavior === "Dynamic").length;
const staticCount = portalFeatures.filter((feature) => feature.behavior === "Static").length;
const uspCount = portalFeatures.filter((feature) => feature.usp).length;

export default function TechnicalDocumentation() {
  const [activeTab, setActiveTab] = useState<DocumentationTab>("overview");
  const [query, setQuery] = useState("");

  const filteredFeatures = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return initialFeatureTracker;
    return initialFeatureTracker.filter((feature) => `${feature.feature} ${feature.area} ${feature.route} ${feature.behavior} ${feature.deliveryNote}`.toLowerCase().includes(normalizedQuery));
  }, [query]);

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>PORTAL HANDBOOK · 0.1.0</p>
          <h2>Technical Documents</h2>
          <p className={styles.intro}>A working reference for the portal’s design language, technology, capabilities, and delivery direction.</p>
        </div>
        <div className={styles.heroAside}>
          <span className={styles.statusPip}><span /> Product blueprint</span>
          <p>Separate what works in this prototype from what production delivery still needs.</p>
        </div>
      </header>

      <div className={styles.tabScroller}>
        <div className={styles.tabs} role="tablist" aria-label="Technical documentation sections">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              className={`${styles.tab} ${activeTab === id ? styles.activeTab : ""}`}
              key={id}
              id={`documentation-tab-${id}`}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              aria-controls="documentation-panel"
              tabIndex={activeTab === id ? 0 : -1}
              onClick={() => setActiveTab(id)}
              onKeyDown={(event) => {
                if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
                event.preventDefault();
                const currentIndex = tabs.findIndex((tab) => tab.id === id);
                const nextIndex = (currentIndex + (event.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length;
                const nextTab = tabs[nextIndex];
                setActiveTab(nextTab.id);
                document.getElementById(`documentation-tab-${nextTab.id}`)?.focus();
              }}
            >
              <Icon size={16} aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <section className={styles.panel} id="documentation-panel" role="tabpanel" aria-labelledby={`documentation-tab-${activeTab}`} tabIndex={0}>
        {activeTab === "overview" && (
          <div className={styles.overview}>
            <div className={styles.sectionHeading}><div><p className={styles.sectionKicker}>REFERENCE GUIDE</p><h3>What this handbook covers</h3></div><span className={styles.versionTag}>Prototype v0.1.0</span></div>
            <p className={styles.lead}>This is the shared reference for the Morgan Ask the Expert portal. It records the system we are building and gives the team a lightweight place to keep delivery status current.</p>
            <div className={styles.snapshotGrid} aria-label="Portal blueprint summary">
              <Snapshot icon={<Sparkles size={17} />} label="Experience USPs" value={String(uspCount)} detail="Distinctive customer value" />
              <Snapshot icon={<Zap size={17} />} label="Dynamic features" value={String(dynamicCount)} detail="Interactive in the prototype" />
              <Snapshot icon={<BookOpenText size={17} />} label="Static features" value={String(staticCount)} detail="Stable reference content" />
              <Snapshot icon={<Coins size={17} />} label="Indicative build" value="$31.8k-$94k" detail="53-94 working days" />
            </div>
            <div className={styles.uspBlock}>
              <div className={styles.uspHeading}><div><p className={styles.sectionKicker}>WHY THIS PORTAL</p><h3>Useful by design</h3></div><span>{uspCount} customer-facing USPs</span></div>
              <div className={styles.uspGrid}>{portalFeatures.filter((feature) => feature.usp).map((feature) => <article className={styles.uspCard} key={feature.id}><span className={styles.uspIcon}><Sparkles size={16} aria-hidden="true" /></span><div><strong>{feature.name}</strong><p>{feature.detail}</p><span className={styles.dynamicPill}>Dynamic · {feature.effort}</span></div></article>)}</div>
            </div>
            <div className={styles.overviewGrid}>
              <OverviewCard icon={<Palette size={18} />} title="Design language" detail="Brand colors, spacing, controls, and component behavior." />
              <OverviewCard icon={<Type size={18} />} title="Typography" detail="Roboto hierarchy and guidance for readable content." />
              <OverviewCard icon={<Workflow size={18} />} title="Technology" detail="Runtime, UI, motion, and graphics dependencies." />
              <OverviewCard icon={<ClipboardList size={18} />} title="Effort & scope" detail="Compare dynamic and static scope, delivery effort, and cost assumptions." />
            </div>
            <div className={styles.note}><strong>Estimate basis</strong><span>{estimateAssumptions.rate} · {estimateAssumptions.day}. Ranges are directional planning figures, not a supplier quote.</span></div>
          </div>
        )}

        {activeTab === "design" && (
          <div className={styles.section}>
            <SectionHeading kicker="VISUAL LANGUAGE" title="Design system" description="Use Morgan’s core palette and consistent interaction patterns throughout the portal." />
            <div className={styles.colorGrid}>
              {designTokens.colors.map((color) => <article className={styles.colorCard} key={color.name}><span className={styles.swatch} style={{ backgroundColor: color.value, color: color.value === "#FFFFFF" ? "#002F5F" : "#FFFFFF" }}>{color.value}</span><div><strong>{color.name}</strong><p>{color.use}</p></div></article>)}
            </div>
            <div className={styles.detailGrid}>
              <article className={styles.detailCard}><h4>Spacing scale</h4><p>Base rhythm for layouts, controls, and card interiors.</p><div className={styles.tokenList}>{designTokens.spacing.map((token) => <span key={token}>{token}</span>)}</div></article>
              <article className={styles.detailCard}><h4>Shape and depth</h4><p>Keep surfaces crisp and elevation restrained.</p><div className={styles.tokenList}>{designTokens.radii.map((token) => <span key={token}>{token}</span>)}</div></article>
            </div>
            <div className={styles.guidanceList}><Guidance title="Interaction" text="Use visible focus, predictable hover states, and clear active navigation." /><Guidance title="Motion" text="Keep GSAP transitions short and purposeful; honor reduced-motion preferences." /><Guidance title="Surface" text="Prefer white surfaces, Morgan blue structure, and orange for a single clear accent." /></div>
          </div>
        )}

        {activeTab === "typography" && (
          <div className={styles.section}>
            <SectionHeading kicker="READABILITY" title="Typography" description="Roboto is the shared interface family. Use clear weight and size contrast instead of decorative styling." />
            <div className={styles.typePreview}><span>ROBOTO · MORGAN ASK THE EXPERT</span><strong>Clear answers start with clear type.</strong><p>Product guidance, document details, and expert responses should remain easy to scan at every viewport size.</p></div>
            <div className={styles.tableWrap}><table className={styles.referenceTable}><thead><tr><th>Style</th><th>Size</th><th>Weight</th><th>Use</th></tr></thead><tbody>{typographyScale.map((row) => <tr key={row.name}><th scope="row">{row.name}</th><td>{row.size}</td><td>{row.weight}</td><td>{row.use}</td></tr>)}</tbody></table></div>
            <p className={styles.caption}>Body copy should use a comfortable line height (1.45–1.65). Reserve uppercase text for short labels.</p>
          </div>
        )}

        {activeTab === "technology" && (
          <div className={styles.section}>
            <SectionHeading kicker="IMPLEMENTATION" title="Technology stack" description="The portal uses a small set of focused libraries for routing, accessible controls, and motion." />
            <div className={styles.tableWrap}><table className={styles.referenceTable}><thead><tr><th>Layer</th><th>Technology</th><th>Purpose</th></tr></thead><tbody>{technologyStack.map((row) => <tr key={row.layer}><th scope="row">{row.layer}</th><td><strong>{row.technology}</strong></td><td>{row.role}</td></tr>)}</tbody></table></div>
            <div className={styles.note}><strong>Implementation note</strong><span>Keep server-rendered content as the default. Add client state where needed. Identity, search, service integrations, and shared storage are production work beyond the prototype UI.</span></div>
          </div>
        )}

        {activeTab === "features" && (
          <div className={styles.section}>
            <SectionHeading kicker="PRODUCT MAP" title="Portal features" description="A concise inventory of the core visitor and customer journeys in this prototype." />
            <div className={styles.featureGrid}>{portalFeatures.map((feature) => <article className={styles.featureCard} key={feature.route}><div className={styles.featureCardMeta}><span className={feature.behavior === "Dynamic" ? styles.dynamicPill : styles.staticPill}>{feature.behavior}</span>{feature.usp && <span className={styles.uspPill}><Sparkles size={11} /> USP</span>}<span className={styles.routeLabel}>{feature.route}</span></div><h4>{feature.name}</h4><p>{feature.detail}</p><div className={styles.featureEstimate}><span><Clock3 size={13} /> {feature.effort}</span><strong>{feature.cost}</strong></div><Link href={feature.route}>Explore feature <ArrowUpRight size={14} aria-hidden="true" /></Link></article>)}</div>
          </div>
        )}

        {activeTab === "tracker" && (
          <div className={styles.section}>
            <div className={styles.trackerHeader}><SectionHeading kicker="PLANNING VIEW" title="Feature effort & cost" description="Search the functionality inventory and compare behavior, delivery effort, and indicative build cost." /></div>
            <div className={styles.trackerTools}><label className={styles.searchField}><Search size={16} aria-hidden="true" /><span className={styles.visuallyHidden}>Search functionality</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter features, routes, type, or delivery notes" /></label><span className={styles.savedState}>{filteredFeatures.length} of {initialFeatureTracker.length} features</span></div>
            <div className={styles.tableWrap}><table className={`${styles.referenceTable} ${styles.effortTable}`}><thead><tr><th>Feature</th><th>Behavior</th><th>USP</th><th>Route</th><th>Effort</th><th>Indicative cost</th><th>Production delivery note</th></tr></thead><tbody>{filteredFeatures.map((feature) => <tr key={feature.id}><th scope="row">{feature.feature}<small>{feature.area}</small></th><td><span className={feature.behavior === "Dynamic" ? styles.dynamicPill : styles.staticPill}>{feature.behavior}</span></td><td>{feature.usp ? <span className={styles.uspPill}><Sparkles size={11} /> Yes</span> : <span className={styles.noUsp}>—</span>}</td><td><code>{feature.route}</code></td><td><span className={styles.effortValue}><Clock3 size={13} />{feature.effort}</span></td><td><strong className={styles.costValue}>{feature.cost}</strong></td><td>{feature.deliveryNote}</td></tr>)}{filteredFeatures.length === 0 && <tr><td className={styles.emptyState} colSpan={7}>No features match this filter.</td></tr>}</tbody></table></div>
            <div className={styles.estimateNote}><strong>Estimate assumptions</strong><p>{estimateAssumptions.scope} We use a blended rate of {estimateAssumptions.rate} and an {estimateAssumptions.day}. The total planning envelope is approximately <b>$31,800-$94,000 across 53-94 person-days</b>.</p><p>{estimateAssumptions.excludes} Actual effort depends on approved requirements, integrations, security, and content readiness.</p></div>
          </div>
        )}

        {activeTab === "releases" && (
          <div className={styles.section}>
            <SectionHeading kicker="CHANGE HISTORY" title="Version history" description="Prototype milestones record meaningful changes to the experience and implementation." />
            <ol className={styles.releaseList}>{releaseHistory.map((release) => <li className={styles.release} key={release.version}><span className={styles.releaseMarker}><Check size={14} aria-hidden="true" /></span><div className={styles.releaseContent}><div><span className={styles.versionTag}>{release.version}</span><time>{release.date}</time></div><h4>{release.title}</h4><p>{release.detail}</p></div></li>)}</ol>
          </div>
        )}
      </section>
    </main>
  );
}

function OverviewCard({ icon, title, detail }: { icon: React.ReactNode; title: string; detail: string }) {
  return <article className={styles.overviewCard}><span>{icon}</span><div><strong>{title}</strong><p>{detail}</p></div></article>;
}

function Snapshot({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string; detail: string }) {
  return <article className={styles.snapshotCard}><span>{icon}</span><div><small>{label}</small><strong>{value}</strong><p>{detail}</p></div></article>;
}

function SectionHeading({ kicker, title, description }: { kicker: string; title: string; description: string }) {
  return <div className={styles.sectionHeading}><div><p className={styles.sectionKicker}>{kicker}</p><h3>{title}</h3><p className={styles.sectionDescription}>{description}</p></div></div>;
}

function Guidance({ title, text }: { title: string; text: string }) {
  return <article className={styles.guidance}><span /><div><strong>{title}</strong><p>{text}</p></div></article>;
}
