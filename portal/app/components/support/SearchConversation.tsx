"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, FileText } from "../Icon";
import { Badge, Button, Card, EmptyState, Grid, Stack } from "../ui";
import { ChatBubble } from "./ChatBubble";
import chat from "./Chat.module.css";
import styles from "./SearchConversation.module.css";
import { categories, products } from "@/app/lib/mock-data";
import { getMockAiAnswer, searchIndexedResources, type IndexedResource } from "@/app/lib/site-index";
import { useCatalogSettings } from "@/app/lib/catalog-settings";
import { usePublishedKnowledge } from "@/app/lib/admin-knowledge-base";
import { isExpertThread, threadHref, useRoutingRequests } from "@/app/lib/expert-routing";
import { useRole } from "@/app/lib/session";
import { signInHref } from "./RequireSignIn";
import { mascotConfig } from "@/app/lib/mascot";

type Props = { query: string; industryId: string; productId: string; expertTeam: string };

const MAX_SOURCES = 3;

/**
 * Morgan AI answer for a question. Every answer cites its sources (documents
 * and products); if the answer is not enough, the visitor continues with a
 * human expert, carrying the question and context over.
 */
export default function SearchConversation({ query, industryId, productId, expertTeam }: Props) {
  const { hiddenDocumentIds, hiddenProductIds } = useCatalogSettings();
  const published = usePublishedKnowledge();
  const requests = useRoutingRequests();
  const signedOut = useRole() === "Visitor";

  const product = products.find((item) => item.id === productId);
  const category = product ? categories.find((item) => item.slug === product.category) : undefined;
  const visible = (resource: IndexedResource) => !hiddenDocumentIds.includes(resource.id);

  const term = `${query} ${product?.name ?? ""} ${category?.name ?? ""}`.trim().toLowerCase();
  const managed = published.filter(
    (resource) => (!category || resource.category === category.name) && `${resource.title} ${resource.summary} ${resource.category} ${resource.keywords.join(" ")}`.toLowerCase().includes(term),
  );
  const documents = [...searchIndexedResources(term).filter(visible), ...managed];
  const answer = getMockAiAnswer(query, documents);

  // The selected product first, then other visible products the question or its documents point to.
  const sourceProducts = products
    .filter((item) => {
      if (hiddenProductIds.includes(item.id)) return false;
      if (item.id === productId) return true;
      if (industryId && !item.industryIds.includes(industryId)) return false;
      const mentioned = query && `${item.name} ${item.description} ${item.categoryName}`.toLowerCase().includes(query.toLowerCase());
      return mentioned && documents.some((resource) => resource.category === item.categoryName);
    })
    .sort((a, b) => Number(b.id === productId) - Number(a.id === productId));

  const current = requests.find((request) => request.query === query && request.industryId === industryId && request.productId === productId);
  const history = requests
    .filter((request) => request.industryId === industryId && request.productId === productId && request.id !== current?.id)
    .slice(0, 8)
    .reverse();

  // A short “thinking” beat before each new answer (skipped for reduced motion).
  const answerKey = `${query}|${industryId}|${productId}`;
  const [revealedKey, setRevealedKey] = useState("");
  useEffect(() => {
    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 900;
    const timer = window.setTimeout(() => setRevealedKey(answerKey), delay);
    return () => window.clearTimeout(timer);
  }, [answerKey]);
  const thinking = revealedKey !== answerKey;

  const askExpertHref = `/questions?${new URLSearchParams({ q: query, industry: industryId, product: productId, team: expertTeam })}`;
  const hasSources = documents.length > 0 || sourceProducts.length > 0;

  return (
    <Stack gap={8}>
      <section className={chat.transcript} aria-label="Questions and answers">
        {history.map((item) => (
          <div className={styles.turn} key={item.id}>
            <ChatBubble author="customer" name="You" align="end">
              {item.query}
            </ChatBubble>
            <ChatBubble author="ai" name="Morgan AI">
              <p>{getMockAiAnswer(item.query, searchIndexedResources(`${item.query} ${item.product}`).filter(visible)).answer}</p>
            </ChatBubble>
          </div>
        ))}
        {history.length > 0 && <p className={chat.divider}>Latest question</p>}

        <div className={styles.turn}>
          <ChatBubble author="customer" name="You" align="end">
            {query || "Browse Morgan resources"}
          </ChatBubble>
          <ChatBubble author="ai" name="Morgan AI" mood={thinking ? "think" : "happy"}>
            {thinking ? (
              <p className={styles.thinking} role="status">
                <span className={styles.typing} aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                {mascotConfig.lines.think[0]}
              </p>
            ) : (
              <div className={styles.answer}>
                <p>{answer.answer}</p>
                <section className={styles.sources} aria-labelledby="answer-sources-title">
                  <div className={styles.sourcesHeading}>
                    <h2 id="answer-sources-title" className={styles.sourcesTitle}>
                      Sources
                    </h2>
                    <span className={styles.cardText}>From morganthermalceramics.com</span>
                  </div>
    
                  {!hasSources && (
                    <EmptyState
                      icon={<FileText size={20} />}
                      title="No sources found"
                      description="Try other words, or ask an expert below."
                      action={
                        <Button href="/documents" variant="secondary" size="sm" trailing={<ArrowRight size={14} aria-hidden="true" />}>
                          Browse documents
                        </Button>
                      }
                    />
                  )}
    
                  {sourceProducts.length > 0 && (
                    <SourceGroup title="Products" count={sourceProducts.length}>
                      {sourceProducts.slice(0, MAX_SOURCES).map((item) => (
                        <SourceCard key={item.id} href={item.url} label={item.categoryName} title={item.name} summary={item.description} linkText="View product" />
                      ))}
                    </SourceGroup>
                  )}
    
                  {documents.length > 0 && (
                    <SourceGroup title="Documents" count={documents.length}>
                      {documents.slice(0, MAX_SOURCES).map((resource) => (
                        <SourceCard
                          key={resource.id}
                          href={resource.url}
                          label={`${resource.type} · ${resource.category}`}
                          title={resource.title}
                          summary={resource.summary}
                          linkText="Open document"
                        />
                      ))}
                    </SourceGroup>
                  )}
                </section>
              </div>
            )}
          </ChatBubble>
        </div>
      </section>

      {query &&
        !thinking &&
        (current && isExpertThread(current) ? (
          <Card tone="muted" as="aside" aria-labelledby="expert-handoff-title">
            <div className={styles.cta}>
              <div className={styles.ctaCopy}>
                <h2 id="expert-handoff-title" className={styles.ctaTitle}>
                  You have an expert chat for this
                </h2>
                <p className={styles.cardText}>Continue with {current.expertTeam}.</p>
              </div>
              <Button href={threadHref(current)} trailing={<ArrowRight size={16} aria-hidden="true" />}>
                Open chat
              </Button>
            </div>
          </Card>
        ) : (
          <Card tone="accent" as="aside" aria-labelledby="expert-handoff-title">
            <div className={styles.cta}>
              <div className={styles.ctaCopy}>
                <h2 id="expert-handoff-title" className={styles.ctaTitle}>
                  Need more help? Ask an expert
                </h2>
                <p className={styles.cardText}>
                  {expertTeam || "A Morgan specialist"} will pick up your question — no need to repeat it.
                  {signedOut && " Sign in first to start a chat."}
                </p>
              </div>
              <Button href={signedOut ? signInHref(askExpertHref) : askExpertHref} variant="accent" trailing={<ArrowRight size={16} aria-hidden="true" />}>
                {signedOut ? "Sign in" : "Ask an expert"}
              </Button>
            </div>
          </Card>
        ))}
    </Stack>
  );
}

function SourceGroup({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div className={styles.sourceGroup}>
      <h3 className={styles.sourceGroupTitle}>
        {title} <Badge>{count > MAX_SOURCES ? `Top ${MAX_SOURCES} of ${count}` : count}</Badge>
      </h3>
      <Grid min={220} gap={3}>
        {children}
      </Grid>
    </div>
  );
}

function SourceCard({ href, label, title, summary, linkText }: { href: string; label: string; title: string; summary: string; linkText: string }) {
  return (
    <Card href={href} external padding="sm">
      <Badge tone="brand">{label}</Badge>
      <h4 className={styles.cardTitle}>{title}</h4>
      <p className={styles.cardText}>{summary}</p>
      <span className={styles.cardLink}>
        {linkText} <ArrowUpRight size={14} aria-hidden="true" />
        <span className="visually-hidden"> (opens in a new tab)</span>
      </span>
    </Card>
  );
}
