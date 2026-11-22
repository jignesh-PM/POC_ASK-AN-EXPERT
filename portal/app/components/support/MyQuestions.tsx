"use client";

import { useState } from "react";
import { ArrowRight, Clock3, Headset, MessageSquareText, Sparkles } from "../Icon";
import { Badge, Button, Card, EmptyState, Field, SearchInput, Stack, Tabs, type TabItem } from "../ui";
import { formatTimestamp, threadStatus } from "./thread-status";
import styles from "./MyQuestions.module.css";
import { isExpertThread, threadHref, useConversationMessages, useMyQuestions } from "@/app/lib/expert-routing";

type Filter = "all" | "ai" | "expert";

/** Every question the signed-in user has asked, with its Morgan AI answer or expert chat. */
export default function MyQuestions() {
  const questions = useMyQuestions();
  const conversations = useConversationMessages();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const expertCount = questions.filter(isExpertThread).length;
  const tabs: TabItem<Filter>[] = [
    { id: "all", label: `All (${questions.length})` },
    { id: "ai", label: `Morgan AI answers (${questions.length - expertCount})`, icon: <Sparkles size={15} aria-hidden="true" /> },
    { id: "expert", label: `Expert chats (${expertCount})`, icon: <Headset size={15} aria-hidden="true" /> },
  ];

  const term = query.trim().toLowerCase();
  const visible = questions.filter((question) => {
    if (filter === "ai" && isExpertThread(question)) return false;
    if (filter === "expert" && !isExpertThread(question)) return false;
    return !term || `${question.query} ${question.product} ${question.industry} ${question.expertTeam}`.toLowerCase().includes(term);
  });

  if (!questions.length) {
    return (
      <EmptyState
        icon={<MessageSquareText size={22} />}
        title="You haven’t asked anything yet"
        description="Ask a question in the search bar to get a Morgan AI answer with sources. You can continue any answer with a Morgan expert."
        action={
          <Button href="/questions?mode=expert" variant="accent" size="sm" leading={<Headset size={14} aria-hidden="true" />}>
            Ask an expert
          </Button>
        }
      />
    );
  }

  return (
    <Stack gap={4}>
      <div className={styles.toolbar}>
        <Tabs items={tabs} value={filter} onChange={setFilter} label="Filter questions" />
        <Field label="Search your questions" hideLabel className={styles.search}>
          <SearchInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your questions" />
        </Field>
      </div>

      {visible.length ? (
        <ul className={styles.list} aria-label="Your questions">
          {visible.map((question) => {
            const status = threadStatus(question);
            const expert = isExpertThread(question);
            const replies = (conversations[question.id] ?? []).filter((message) => message.sender === "expert").length;
            return (
              <li key={question.id}>
                <Card href={threadHref(question)} padding="sm">
                  <div className={styles.row}>
                    <span className={expert ? styles.kindExpert : styles.kindAi} aria-hidden="true">
                      {expert ? <Headset size={18} /> : <Sparkles size={18} />}
                    </span>
                    <div className={styles.copy}>
                      <strong className={styles.title}>{question.query}</strong>
                      <span className={styles.meta}>
                        {[question.product, question.industry, expert && `Routed to ${question.expertTeam}`].filter(Boolean).join(" · ")}
                      </span>
                    </div>
                    <div className={styles.aside}>
                      <Badge tone={status.tone}>{status.label}</Badge>
                      <span className={styles.meta}>
                        <Clock3 size={12} aria-hidden="true" /> {formatTimestamp(question.createdAt)}
                        {expert && ` · ${replies} ${replies === 1 ? "reply" : "replies"}`}
                      </span>
                    </div>
                    <span className={styles.open}>
                      {expert ? "Open chat" : "View answer"} <ArrowRight size={14} aria-hidden="true" />
                    </span>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState
          title="No questions match"
          description="Try another search, or switch the filter."
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setQuery("");
                setFilter("all");
              }}
            >
              Clear filters
            </Button>
          }
        />
      )}
    </Stack>
  );
}
