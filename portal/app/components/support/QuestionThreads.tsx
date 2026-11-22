"use client";

import { ArrowRight, Clock3, Headset, MessageSquareText, Sparkles } from "../Icon";
import { Badge, Button, Card, EmptyState, IconTile, SectionHeader, Stack } from "../ui";
import { formatTimestamp, threadStatus } from "./thread-status";
import styles from "./QuestionThreads.module.css";
import { threadHref, useRoutingRequests } from "@/app/lib/expert-routing";

/** Header actions on the support hub: Morgan AI or a human expert. */
export function SupportHubActions() {
  return (
    <>
      <Button href="/categories" variant="secondary" leading={<Sparkles size={16} aria-hidden="true" />}>
        Ask Morgan AI
      </Button>
      <Button href="/questions?mode=expert" variant="accent" leading={<Headset size={16} aria-hidden="true" />}>
        Talk to an expert
      </Button>
    </>
  );
}

/** Recent Morgan AI and expert threads saved in this browser. */
export default function QuestionThreads() {
  const requests = useRoutingRequests();

  return (
    <section aria-labelledby="threads-title">
      <Stack gap={4}>
        <SectionHeader id="threads-title" eyebrow="Product community" title="Recent product threads" actions={<Badge>{requests.length} threads</Badge>} />
        {requests.length ? (
          <ul className={styles.list}>
            {requests.slice(0, 12).map((request) => {
              const status = threadStatus(request);
              return (
                <li key={request.id}>
                  <Card href={threadHref(request)} padding="sm">
                    <div className={styles.row}>
                      <IconTile size="sm">
                        <MessageSquareText size={16} />
                      </IconTile>
                      <div className={styles.copy}>
                        <strong className={styles.title}>{request.query}</strong>
                        <span className={styles.meta}>{[request.industry, request.product, request.expertTeam].filter(Boolean).join(" · ")}</span>
                      </div>
                      <div className={styles.aside}>
                        <Badge tone={status.tone}>{status.label}</Badge>
                        <time className={styles.meta} dateTime={request.createdAt}>
                          <Clock3 size={12} aria-hidden="true" /> {formatTimestamp(request.createdAt, false)}
                        </time>
                      </div>
                      <ArrowRight className={styles.arrow} size={16} aria-hidden="true" />
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyState
            icon={<MessageSquareText size={22} />}
            title="No conversations yet"
            description="Ask Morgan AI about a product line, or open a separate chat with a Morgan expert."
            action={
              <Button href="/categories" variant="secondary" size="sm" trailing={<ArrowRight size={14} aria-hidden="true" />}>
                Browse product lines
              </Button>
            }
          />
        )}
      </Stack>
    </section>
  );
}
