"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, MessageSquareText, Send } from "@/app/components/Icon";
import { Alert, Badge, Button, Card, EmptyState, Field, IconTile, SectionHeader, Select, Stack, Textarea } from "@/app/components/ui";
import { getSearchContext, isExpertThread, saveSearchRoutingRequest, threadHref, useConversationMessages, useRoutingRequests, type SearchRoutingRequest } from "@/app/lib/expert-routing";
import { industries } from "@/app/lib/mock-data";
import { useVisibleProducts, type Category } from "./catalog-data";
import styles from "./ProductCommunity.module.css";

function threadStatus(thread: SearchRoutingRequest) {
  if (!isExpertThread(thread)) return { label: "Morgan AI answer available", action: "View AI answer" };
  return { label: thread.status === "Resolved" ? "Resolved expert chat" : "Expert chat started", action: "Open expert chat" };
}

/** Ask-a-question form and the existing question threads for one product range. */
export function ProductCommunity({ category }: { category: Category }) {
  const router = useRouter();
  const requests = useRoutingRequests();
  const messages = useConversationMessages();
  const rangeProducts = useVisibleProducts().filter((product) => product.category === category.slug);

  const [question, setQuestion] = useState("");
  const [industryId, setIndustryId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [error, setError] = useState("");

  // Only offer products used in the chosen industry; fall back to the first match.
  const availableProducts = rangeProducts.filter((product) => !industryId || product.industryIds.includes(industryId));
  const productId = availableProducts.some((product) => product.id === selectedProductId) ? selectedProductId : (availableProducts[0]?.id ?? "");
  const threads = requests.filter((request) => request.category === category.name && request.productId);

  const submit = (event: FormEvent<HTMLElement>) => {
    event.preventDefault();
    if (!question.trim()) return setError("Write a question to start the thread.");
    if (!industryId) return setError("Choose an industry so the right product team can respond.");
    saveSearchRoutingRequest(question, industryId, productId);
    const params = new URLSearchParams({ q: question.trim(), industry: industryId, product: productId, team: getSearchContext(industryId, productId).expertTeam });
    router.push(`/search?${params}`);
  };

  return (
    <Stack as="section" gap={4} aria-labelledby="product-community-title">
      <SectionHeader
        id="product-community-title"
        eyebrow="Product community"
        title={`Questions about ${category.name}`}
        actions={
          <Badge tone="brand">
            <MessageSquareText size={14} aria-hidden="true" />
            {threads.length} {threads.length === 1 ? "thread" : "threads"}
          </Badge>
        }
      />

      <div className={styles.layout}>
        <Card as="form" padding="lg" onSubmit={submit} aria-label={`Ask a question about ${category.name}`}>
          <Field label="Your question">
            <Textarea
              rows={4}
              value={question}
              onChange={(event) => {
                setQuestion(event.target.value);
                setError("");
              }}
              placeholder={`Ask a product or application question about ${category.name}…`}
            />
          </Field>
          <div className={styles.selects}>
            <Field label="Industry">
              <Select
                value={industryId}
                onChange={(event) => {
                  setIndustryId(event.target.value);
                  setError("");
                }}
              >
                <option value="">Choose an industry</option>
                {industries.map((industry) => (
                  <option value={industry.id} key={industry.id}>
                    {industry.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Product">
              <Select value={productId} onChange={(event) => setSelectedProductId(event.target.value)} disabled={!availableProducts.length}>
                {availableProducts.length ? (
                  availableProducts.map((product) => (
                    <option value={product.id} key={product.id}>
                      {product.name}
                    </option>
                  ))
                ) : (
                  <option value="">No products for this industry</option>
                )}
              </Select>
            </Field>
          </div>
          {error && <Alert tone="danger">{error}</Alert>}
          <div className={styles.submitRow}>
            <p className={styles.note}>Your question is shared with this product community and answered from Morgan product and document knowledge. You can start an expert chat from the answer.</p>
            <Button type="submit" variant="accent" disabled={!question.trim() || !productId} leading={<Send size={16} aria-hidden="true" />}>
              Ask Morgan AI
            </Button>
          </div>
        </Card>

        {threads.length ? (
          <Stack as="ul" gap={3} aria-label={`${category.name} question threads`}>
            {threads.map((thread) => {
              const status = threadStatus(thread);
              const replies = messages[thread.id]?.length ?? 0;
              return (
                <Card as="li" padding="sm" key={thread.id}>
                  <div className={styles.thread}>
                    <IconTile size="sm">
                      <MessageSquareText size={16} aria-hidden="true" />
                    </IconTile>
                    <div className={styles.threadCopy}>
                      <h3 className={styles.threadTitle}>{thread.query}</h3>
                      <p className={styles.meta}>{[thread.product, thread.industry, thread.expertTeam].filter(Boolean).join(" · ")}</p>
                      <p className={styles.meta}>
                        {status.label} · {replies} {replies === 1 ? "reply" : "replies"}
                      </p>
                    </div>
                    <Button href={threadHref(thread)} variant="link" size="sm" trailing={<ArrowRight size={14} aria-hidden="true" />} aria-label={`${status.action}: ${thread.query}`}>
                      {status.action}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </Stack>
        ) : (
          <EmptyState icon={<MessageSquareText size={22} aria-hidden="true" />} title="Be the first to ask" description={`New questions appear here for everyone exploring ${category.name}.`} />
        )}
      </div>
    </Stack>
  );
}
