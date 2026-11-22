"use client";

import { useState, type ReactNode } from "react";
import { ArrowUpRight, BookOpenText, Check, ClipboardList, Palette, RotateCcw, Sparkles, Type, Workflow, Zap } from "@/app/components/Icon";
import { Alert, Badge, Button, Card, Grid, SectionHeader, Stack, Stat, Tabs, cx, type TabItem } from "@/app/components/ui";
import { designTokens, portalFeatures, releaseHistory, technologyStack, typographyScale } from "@/app/lib/project-documentation";
import styles from "./TechnicalDocumentation.module.css";

type DocTab = "overview" | "design" | "typography" | "technology" | "features" | "releases";

const TAB_LABELS: Record<DocTab, string> = {
  overview: "Overview",
  design: "Design system",
  typography: "Typography",
  technology: "Technology",
  features: "Portal features",
  releases: "Version history",
};

const TAB_ICONS = { overview: BookOpenText, design: Palette, typography: Type, technology: Workflow, features: ClipboardList, releases: RotateCcw };

const TABS: TabItem<DocTab>[] = (Object.keys(TAB_LABELS) as DocTab[]).map((id) => {
  const Icon = TAB_ICONS[id];
  return { id, label: TAB_LABELS[id], icon: <Icon size={16} aria-hidden="true" /> };
});

const uspFeatures = portalFeatures.filter((feature) => feature.usp);
const dynamicCount = portalFeatures.filter((feature) => feature.behavior === "Dynamic").length;
const staticCount = portalFeatures.length - dynamicCount;
const currentVersion = releaseHistory.filter((release) => release.version !== "Next").at(-1)?.version;

/** Tabbed handbook: design system, typography, technology, features and releases. */
export default function TechnicalDocumentation() {
  const [tab, setTab] = useState<DocTab>("overview");
  const panels: Record<DocTab, ReactNode> = {
    overview: <OverviewPanel onNavigate={setTab} />,
    design: <DesignPanel />,
    typography: <TypographyPanel />,
    technology: <TechnologyPanel />,
    features: <FeaturesPanel />,
    releases: <ReleasesPanel />,
  };

  return (
    <Stack gap={6}>
      <Tabs items={TABS} value={tab} onChange={setTab} label="Technical documentation sections" />
      <Card padding="lg" role="tabpanel" aria-label={TAB_LABELS[tab]} tabIndex={0} className={styles.panel}>
        {panels[tab]}
      </Card>
    </Stack>
  );
}

function OverviewPanel({ onNavigate }: { onNavigate: (tab: DocTab) => void }) {
  const guides: { tab: DocTab; icon: ReactNode; title: string; detail: string }[] = [
    { tab: "design", icon: <Palette size={18} />, title: "Design language", detail: "Colour, spacing, shape and elevation tokens." },
    { tab: "typography", icon: <Type size={18} />, title: "Typography", detail: "Roboto type scale and readability guidance." },
    { tab: "technology", icon: <Workflow size={18} />, title: "Technology", detail: "Framework, component library, styling and persistence." },
    { tab: "features", icon: <ClipboardList size={18} />, title: "Portal features", detail: "Customer journeys and what production still needs." },
  ];

  return (
    <Stack gap={8}>
      <SectionHeader
        title="What this handbook covers"
        description="The shared reference for the portal: the system we are building and a lightweight place to keep delivery status current."
        actions={<Badge tone="brand">Prototype v{currentVersion}</Badge>}
      />
      <Grid min={180} gap={3}>
        <Stat label="Experience USPs" value={uspFeatures.length} hint="Distinctive customer value" />
        <Stat label="Dynamic features" value={dynamicCount} hint="Interactive in the prototype" />
        <Stat label="Static features" value={staticCount} hint="Stable reference content" />
        <Stat label="Portal features" value={portalFeatures.length} hint="Core journeys" />
      </Grid>

      <Stack gap={4}>
        <SectionHeader as="h3" title="Useful by design" actions={<Badge tone="accent">{uspFeatures.length} customer-facing USPs</Badge>} />
        <Grid min={240} gap={4}>
          {uspFeatures.map((feature) => (
            <Card tone="muted" key={feature.id}>
              <h4 className={styles.cardTitle}>{feature.name}</h4>
              <p className={styles.cardText}>{feature.detail}</p>
            </Card>
          ))}
        </Grid>
      </Stack>

      <Stack gap={4}>
        <SectionHeader as="h3" title="Sections" />
        <Grid min={220} gap={4}>
          {guides.map((guide) => (
            <Card key={guide.tab} padding="sm" className={styles.guide}>
              <h4 className={styles.cardTitle}>{guide.title}</h4>
              <p className={styles.cardText}>{guide.detail}</p>
              <Button variant="link" size="sm" onClick={() => onNavigate(guide.tab)} trailing={<ArrowUpRight size={14} aria-hidden="true" />}>
                Open {guide.title.toLowerCase()}
              </Button>
            </Card>
          ))}
        </Grid>
      </Stack>
    </Stack>
  );
}

function DesignPanel() {
  return (
    <Stack gap={8}>
      <SectionHeader title="Design system" description="Every colour, size, radius and shadow comes from app/styles/tokens.css. Components reference tokens only." />
      <Grid min={200} gap={4} as="ul" aria-label="Colour tokens">
        {designTokens.colors.map((color) => (
          <li className={styles.colorCard} key={color.token}>
            <span className={cx(styles.swatch, color.inverse && styles.swatchInverse)} style={{ background: `var(${color.token})` }}>
              {color.value}
            </span>
            <span className={styles.colorCopy}>
              <strong>{color.name}</strong>
              <code className={styles.code}>{color.token}</code>
              <span className={styles.cardText}>{color.use}</span>
            </span>
          </li>
        ))}
      </Grid>
      <Grid min={260} gap={4}>
        <TokenCard title="Spacing" detail="4px grid for layouts, controls and card interiors." tokens={designTokens.spacing} />
        <TokenCard title="Shape" detail="Crisp surfaces with restrained rounding." tokens={designTokens.radii} />
        <TokenCard title="Elevation" detail="Shadows stay subtle; focus uses an orange ring." tokens={designTokens.elevation} />
      </Grid>
      <Grid min={220} gap={4}>
        <Guidance title="Interaction">Visible focus rings, predictable hover states and aria-current on active navigation.</Guidance>
        <Guidance title="Motion">Short CSS transitions only; everything respects prefers-reduced-motion.</Guidance>
        <Guidance title="Surface">White cards on a cool grey page, Morgan blue structure and orange as the single accent.</Guidance>
      </Grid>
    </Stack>
  );
}

function TokenCard({ title, detail, tokens }: { title: string; detail: string; tokens: string[] }) {
  return (
    <Card tone="muted">
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardText}>{detail}</p>
      <ul className={styles.tokenList}>
        {tokens.map((token) => (
          <li key={token}>
            <code className={styles.code}>{token}</code>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function Guidance({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className={styles.guidance}>
      <strong>{title}</strong>
      <p className={styles.cardText}>{children}</p>
    </div>
  );
}

function TypographyPanel() {
  return (
    <Stack gap={6}>
      <SectionHeader title="Typography" description="Roboto, loaded with next/font, is the single interface family. Use weight and size contrast instead of decorative styling." />
      <Card tone="brand" padding="lg" className={styles.typePreview}>
        <strong className={styles.previewTitle}>Clear answers start with clear type.</strong>
        <p>Product guidance, document details and expert responses stay easy to scan at every viewport size.</p>
      </Card>
      <DocTable caption="Type scale" head={["Style", "Token", "Size", "Weight", "Use"]}>
        {typographyScale.map((row) => (
          <tr key={row.token}>
            <th scope="row">{row.name}</th>
            <td>
              <code className={styles.code}>{row.token}</code>
            </td>
            <td>{row.size}</td>
            <td>{row.weight}</td>
            <td>{row.use}</td>
          </tr>
        ))}
      </DocTable>
      <p className={styles.caption}>Body copy uses a 1.55 line height. Reserve uppercase for short labels such as table headers.</p>
    </Stack>
  );
}

function TechnologyPanel() {
  return (
    <Stack gap={6}>
      <SectionHeader title="Technology stack" description="A small dependency footprint: Next.js and React, with everything else built in-house." />
      <DocTable caption="Technology stack" head={["Layer", "Technology", "Purpose"]}>
        {technologyStack.map((row) => (
          <tr key={row.layer}>
            <th scope="row">{row.layer}</th>
            <td>
              <strong>{row.technology}</strong>
            </td>
            <td>{row.role}</td>
          </tr>
        ))}
      </DocTable>
      <Alert>
        <strong>Implementation note. </strong>
        Server Components are the default; client state is added only where needed. Identity, search, service integrations and shared storage are production work beyond this prototype.
      </Alert>
    </Stack>
  );
}

function FeaturesPanel() {
  return (
    <Stack gap={6}>
      <SectionHeader title="Portal features" description="A concise inventory of the core visitor, customer and admin journeys in this prototype." />
      <Grid min={260} gap={4}>
        {portalFeatures.map((feature) => (
          <Card key={feature.id} className={styles.feature}>
            <div className={styles.badges}>
              <Badge tone={feature.behavior === "Dynamic" ? "accent" : "neutral"}>{feature.behavior}</Badge>
              {feature.usp && (
                <Badge tone="brand">
                  <Sparkles size={12} aria-hidden="true" /> USP
                </Badge>
              )}
              <code className={styles.code}>{feature.route}</code>
            </div>
            <h3 className={styles.cardTitle}>{feature.name}</h3>
            <p className={styles.cardText}>{feature.detail}</p>
            <p className={styles.note}>
              <strong>Production: </strong>
              {feature.deliveryNote}
            </p>
            {feature.route.startsWith("/") ? (
              <Button href={feature.route} variant="link" size="sm" trailing={<ArrowUpRight size={14} aria-hidden="true" />} className={styles.featureLink}>
                Explore feature
              </Button>
            ) : (
              <span className={styles.caption}>{feature.route === "Header" ? "Available in the portal header" : "Available across portal pages"}</span>
            )}
          </Card>
        ))}
      </Grid>
    </Stack>
  );
}

function ReleasesPanel() {
  return (
    <Stack gap={6}>
      <SectionHeader title="Version history" description="Prototype milestones record meaningful changes to the experience and implementation." />
      <ol className={styles.releases}>
        {releaseHistory.map((release) => (
          <li className={styles.release} key={release.version}>
            <span className={styles.releaseMarker} aria-hidden="true">
              {release.version === "Next" ? <Zap size={14} /> : <Check size={14} />}
            </span>
            <div className={styles.releaseBody}>
              <div className={styles.badges}>
                <Badge tone={release.version === "Next" ? "accent" : "brand"}>{release.version}</Badge>
                <span className={styles.caption}>{release.date}</span>
              </div>
              <h3 className={styles.cardTitle}>{release.title}</h3>
              <p className={styles.cardText}>{release.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </Stack>
  );
}

function DocTable({ caption, head, children }: { caption: string; head: string[]; children: ReactNode }) {
  return (
    <div className={styles.tableWrap} role="region" aria-label={caption} tabIndex={0}>
      <table className={styles.table}>
        <caption className="visually-hidden">{caption}</caption>
        <thead>
          <tr>
            {head.map((cell) => (
              <th scope="col" key={cell}>
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
