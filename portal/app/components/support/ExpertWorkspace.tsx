"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Check, Clock3, Headset, MessageSquareText, Send, ShieldCheck, UserRound } from "../Icon";
import { Alert, Badge, Button, EmptyState, Field, Page, PageHeader, SearchInput, Textarea, cx } from "../ui";
import { ChatBubble } from "./ChatBubble";
import chat from "./Chat.module.css";
import styles from "./ExpertWorkspace.module.css";
import { formatTimestamp, threadStatus } from "./thread-status";
import { appendConversationMessage, initialMessages, setRequestStatus, useConversationMessages, useRoutingRequests, type SearchRoutingRequest } from "@/app/lib/expert-routing";
import { isStaff, useAdminSettings, useRole } from "@/app/lib/session";
import { useProfileCompletion } from "@/app/lib/profile-completion";
import { products } from "@/app/lib/mock-data";
import { STORAGE_KEYS, useStoredJSON, useStoredString } from "@/app/lib/storage";

type ManagedUser = { email: string; role: string; active: boolean; productLines: string[] };
const NO_USERS: ManagedUser[] = [];

/** Product lines a Morgan User may answer (from the admin user list), or `null` when unrestricted. */
function useAssignedProductLines(): string[] | null {
  const role = useRole();
  const users = useStoredJSON(STORAGE_KEYS.adminUsers, NO_USERS);
  const email = useStoredString(STORAGE_KEYS.profileEmail)?.toLowerCase();
  if (role !== "Morgan User") return null;
  const account = users.find((user) => user.email.toLowerCase() === email && user.role === "Morgan User" && user.active);
  return account?.productLines ?? [];
}

const productLine = (request: SearchRoutingRequest) => products.find((product) => product.id === request.productId)?.category ?? "";

/** Expert inbox (Morgan staff) or community conversation view (customers) with a sticky composer. */
export default function ExpertWorkspace() {
  const role = useRole();
  const staff = isStaff(role);
  const { requireProfile } = useAdminSettings();
  const completion = useProfileCompletion();
  const assignedLines = useAssignedProductLines();
  const requests = useRoutingRequests();
  const conversations = useConversationMessages();
  const requestedId = useSearchParams().get("request");

  const [filter, setFilter] = useState("");
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState("");
  const transcriptRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  const allowed = assignedLines ? requests.filter((request) => assignedLines.includes(productLine(request))) : requests;
  const term = filter.trim().toLowerCase();
  const threads = term ? allowed.filter((request) => `${request.query} ${request.industry} ${request.product} ${request.expertTeam}`.toLowerCase().includes(term)) : allowed;
  const active = threads.find((request) => request.id === requestedId) ?? threads[0];
  const messages = active ? conversations[active.id] ?? initialMessages(active) : [];
  const openCount = allowed.filter((request) => request.status !== "Resolved").length;
  const profileRequired = requireProfile && !staff && completion.percent < 100;
  const expertReplied = messages.at(-1)?.sender === "expert";

  const activeId = active?.id;
  useEffect(() => {
    const transcript = transcriptRef.current;
    if (transcript) transcript.scrollTop = transcript.scrollHeight;
  }, [activeId, messages.length]);

  const selectThread = (id: string) => {
    window.history.replaceState(null, "", `/expert?request=${encodeURIComponent(id)}`);
    setStatus("");
    if (window.matchMedia("(max-width: 900px)").matches) panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const send = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!active || profileRequired) return;
    if (appendConversationMessage(active.id, draft, staff ? "expert" : "customer")) {
      setDraft("");
      setStatus("Message sent.");
    }
  };

  const onComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  const resolve = () => {
    if (!active) return;
    setRequestStatus(active.id, "Resolved");
    setStatus("Conversation marked as resolved.");
  };

  const ownSender = staff ? "expert" : "customer";
  const activeStatus = active ? threadStatus(active) : null;

  return (
    <Page width="wide">
      <PageHeader
        eyebrow={staff ? "Support inbox" : "Product community"}
        title={staff ? "Customer conversations" : "Expert conversations"}
        description={
          staff
            ? "Reply to customer questions routed to your product lines. Resolve a chat when the customer has what they need."
            : "Your questions to Morgan subject matter experts. Replies appear here and you can continue the conversation at any time."
        }
        actions={
          <>
            <Badge tone={openCount ? "accent" : "neutral"}>{openCount} open</Badge>
            {!staff && (
              <Button href="/questions?mode=expert" variant="secondary" size="sm" leading={<Headset size={16} aria-hidden="true" />}>
                New expert chat
              </Button>
            )}
          </>
        }
      />

      <div className={styles.workspace}>
        <aside className={styles.inbox} aria-labelledby="inbox-title">
          <h2 id="inbox-title" className="visually-hidden">
            Conversations
          </h2>
          <Field label="Find a conversation" hideLabel>
            <SearchInput value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Find a conversation" />
          </Field>
          {threads.length ? (
            <ul className={styles.threadList}>
              {threads.map((request) => {
                const itemStatus = threadStatus(request);
                const selected = request.id === active?.id;
                return (
                  <li key={request.id}>
                    <button type="button" className={cx(styles.thread, selected && styles.threadActive)} aria-current={selected ? "true" : undefined} onClick={() => selectThread(request.id)}>
                      <span className={styles.threadAvatar} aria-hidden="true">
                        <UserRound size={16} />
                      </span>
                      <span className={styles.threadCopy}>
                        <strong className={styles.threadTitle}>{request.query}</strong>
                        <span className={styles.threadMeta}>{[request.industry, request.product].filter(Boolean).join(" · ")}</span>
                        <span className={styles.threadFooter}>
                          <Badge tone={itemStatus.tone}>{itemStatus.label}</Badge>
                          <time className={styles.threadMeta} dateTime={request.createdAt}>
                            {formatTimestamp(request.createdAt)}
                          </time>
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className={styles.inboxEmpty}>{term ? "No conversations match your search." : "No conversations yet."}</p>
          )}
          <p className={styles.inboxNote}>
            <ShieldCheck size={16} aria-hidden="true" />
            Questions are routed to the Morgan team for the selected product.
          </p>
        </aside>

        <section ref={panelRef} className={styles.panel} aria-labelledby={active ? "conversation-title" : undefined} aria-label={active ? undefined : "Conversation"}>
          {active && activeStatus ? (
            <>
              <header className={styles.panelHeader}>
                <div className={styles.panelCopy}>
                  <p className={styles.panelEyebrow}>{staff ? "Customer ↔ Morgan expert team" : "Morgan expert support"}</p>
                  <h2 id="conversation-title" className={styles.panelTitle}>
                    {active.query}
                  </h2>
                  <p className={styles.panelMeta}>
                    {[active.industry, active.product, `Routed to ${active.expertTeam}`].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <div className={styles.panelActions}>
                  <Badge tone={activeStatus.tone}>{activeStatus.label}</Badge>
                  {staff && active.status !== "Resolved" && (
                    <Button variant="secondary" size="sm" onClick={resolve} leading={<Check size={16} aria-hidden="true" />}>
                      Resolve chat
                    </Button>
                  )}
                </div>
              </header>

              <div ref={transcriptRef} className={styles.transcript} role="log" aria-live="polite" aria-label="Messages between the customer and the Morgan expert team" tabIndex={0}>
                <div className={chat.transcript}>
                  <p className={chat.divider}>Conversation started {formatTimestamp(active.createdAt)}</p>
                  {messages.map((message) => (
                    <ChatBubble
                      key={message.id}
                      author={message.sender}
                      align={message.sender === ownSender ? "end" : "start"}
                      name={message.sender === "customer" ? (staff ? "Customer" : "You") : staff ? "You · Morgan expert" : `Morgan expert · ${active.expertTeam}`}
                      dateTime={message.createdAt}
                      timeLabel={formatTimestamp(message.createdAt)}
                    >
                      {message.text}
                    </ChatBubble>
                  ))}
                  <p className={styles.responseState}>
                    {staff ? <Headset size={16} aria-hidden="true" /> : expertReplied ? <Check size={16} aria-hidden="true" /> : <Clock3 size={16} aria-hidden="true" />}
                    {staff
                      ? "Reply as the Morgan subject matter expert."
                      : active.status === "Resolved"
                        ? "This conversation was marked as resolved. Send a message to reopen it."
                        : expertReplied
                          ? "Morgan's expert team has replied. Continue the conversation below."
                          : "A Morgan subject matter expert will reply in this conversation."}
                  </p>
                </div>
              </div>

              <div className={styles.composer}>
                {profileRequired ? (
                  <Alert tone="warning" icon={<ShieldCheck size={18} aria-hidden="true" />}>
                    <strong>Complete your profile to message a Morgan expert.</strong> Your question is saved in the {active.category || active.product} community thread.{" "}
                    <Button href="/profile#personal-details" variant="link" size="sm" trailing={<ArrowRight size={14} aria-hidden="true" />}>
                      Complete profile
                    </Button>
                  </Alert>
                ) : (
                  <form onSubmit={send} className={styles.composerForm}>
                    <Field label={staff ? "Reply to customer" : "Message the Morgan expert team"} hideLabel>
                      <Textarea
                        rows={2}
                        value={draft}
                        onChange={(event) => {
                          setDraft(event.target.value);
                          setStatus("");
                        }}
                        onKeyDown={onComposerKeyDown}
                        placeholder={staff ? "Write a reply to the customer…" : "Ask a follow-up question…"}
                        aria-describedby="composer-hint"
                        className={styles.composerInput}
                      />
                    </Field>
                    <div className={styles.composerBar}>
                      <span id="composer-hint" className={styles.composerHint} role="status">
                        {status || "Enter to send · Shift + Enter for a new line"}
                      </span>
                      <Button type="submit" disabled={!draft.trim()} trailing={<Send size={16} aria-hidden="true" />}>
                        Send
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </>
          ) : (
            <EmptyState
              className={styles.panelEmpty}
              icon={<MessageSquareText size={22} />}
              title={allowed.length ? "Choose a conversation" : "No conversations yet"}
              description={
                allowed.length
                  ? "Select a question from the list to open the conversation."
                  : staff
                    ? "Customer questions routed to your product lines will appear here."
                    : "Ask Morgan AI first, or start a separate chat with a product specialist."
              }
              action={
                !staff && !allowed.length ? (
                  <Button href="/questions?mode=expert" variant="accent" size="sm" leading={<Headset size={16} aria-hidden="true" />}>
                    Start an expert chat
                  </Button>
                ) : undefined
              }
            />
          )}
        </section>
      </div>
    </Page>
  );
}
