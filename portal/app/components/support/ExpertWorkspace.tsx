"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Check, Clock3, Headset, MessageSquareText, Send, ShieldCheck, UserRound } from "../Icon";
import { Alert, Badge, Button, EmptyState, Field, Page, PageHeader, SearchInput, Textarea, cx } from "../ui";
import { ChatBubble } from "./ChatBubble";
import chat from "./Chat.module.css";
import styles from "./ExpertWorkspace.module.css";
import { formatTimestamp, threadStatus } from "./thread-status";
import { appendConversationMessage, initialMessages, setRequestStatus, useConversationMessages, useRoutingRequests } from "@/app/lib/expert-routing";
import { isStaff, useAdminSettings, useRole } from "@/app/lib/session";
import { useProfileCompletion } from "@/app/lib/profile-completion";
import RequireSignIn from "./RequireSignIn";
import { celebrate } from "@/app/lib/celebrate";

/** Signed-in users only; visitors are asked to sign in and come back to the same thread. */
export default function ExpertWorkspace() {
  const requestedId = useSearchParams().get("request");
  const next = requestedId ? `/expert?${new URLSearchParams({ request: requestedId })}` : "/expert";
  return (
    <RequireSignIn next={next}>
      <ExpertInbox requestedId={requestedId} />
    </RequireSignIn>
  );
}

/**
 * Expert inbox (Morgan staff) or conversation view (customers) with a sticky composer.
 * POC: Morgan users see every conversation; each still shows the team it was routed to
 * by the admin configuration. Production would limit staff to their routed product lines.
 */
function ExpertInbox({ requestedId }: { requestedId: string | null }) {
  const role = useRole();
  const staff = isStaff(role);
  const { requireProfile } = useAdminSettings();
  const completion = useProfileCompletion();
  const requests = useRoutingRequests();
  const conversations = useConversationMessages();

  const [filter, setFilter] = useState("");
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState("");
  const transcriptRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  const term = filter.trim().toLowerCase();
  const threads = term ? requests.filter((request) => `${request.query} ${request.industry} ${request.product} ${request.expertTeam}`.toLowerCase().includes(term)) : requests;
  const active = threads.find((request) => request.id === requestedId) ?? threads[0];
  const messages = active ? conversations[active.id] ?? initialMessages(active) : [];
  const openCount = requests.filter((request) => request.status !== "Resolved").length;
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
    celebrate(document.activeElement);
    setStatus("Chat resolved.");
  };

  const ownSender = staff ? "expert" : "customer";
  const activeStatus = active ? threadStatus(active) : null;

  return (
    <Page width="wide">
      <PageHeader
        title={staff ? "Customer chats" : "Expert chats"}
        description={
          staff
            ? "Reply to customers and resolve each chat once answered."
            : "Your chats with Morgan experts. Replies appear here."
        }
        actions={
          <>
            <Badge tone={openCount ? "accent" : "neutral"}>{openCount} open</Badge>
            {!staff && (
              <Button href="/profile/questions" variant="secondary" size="sm" leading={<MessageSquareText size={16} aria-hidden="true" />}>
                My questions
              </Button>
            )}
            {!staff && (
              <Button href="/questions?mode=expert" variant="secondary" size="sm" leading={<Headset size={16} aria-hidden="true" />}>
                New expert chat
              </Button>
            )}
          </>
        }
      />

      {staff && (
        <Alert tone="info" icon={<ShieldCheck size={18} aria-hidden="true" />}>
          <strong>Prototype:</strong> all Morgan users see every chat. Each chat shows the team it is routed to in Admin › Expert teams.
        </Alert>
      )}

      <div className={styles.workspace}>
        <aside className={styles.inbox} aria-labelledby="inbox-title">
          <h2 id="inbox-title" className="visually-hidden">
            Chats
          </h2>
          <Field label="Search chats" hideLabel>
            <SearchInput value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Search chats" />
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
            <p className={styles.inboxEmpty}>{term ? "No chats match your search." : "No chats yet."}</p>
          )}
          <p className={styles.inboxNote}>
            <ShieldCheck size={16} aria-hidden="true" />
            Each question goes to the Morgan team for its product.
          </p>
        </aside>

        <section ref={panelRef} className={styles.panel} aria-labelledby={active ? "conversation-title" : undefined} aria-label={active ? undefined : "Chat"}>
          {active && activeStatus ? (
            <>
              <header className={styles.panelHeader}>
                <div className={styles.panelCopy}>
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

              <div ref={transcriptRef} className={styles.transcript} role="log" aria-live="polite" aria-label="Messages" tabIndex={0}>
                <div className={chat.transcript}>
                  <p className={chat.divider}>Started {formatTimestamp(active.createdAt)}</p>
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
                      ? "You are replying as the Morgan expert."
                      : active.status === "Resolved"
                        ? "Resolved. Send a message to reopen this chat."
                        : expertReplied
                          ? "A Morgan expert has replied."
                          : "A Morgan expert will reply here."}
                  </p>
                </div>
              </div>

              <div className={styles.composer}>
                {profileRequired ? (
                  <Alert tone="warning" icon={<ShieldCheck size={18} aria-hidden="true" />}>
                    <strong>Complete your profile to message a Morgan expert.</strong> Your question is saved.{" "}
                    <Button href="/profile#personal-details" variant="link" size="sm" trailing={<ArrowRight size={14} aria-hidden="true" />}>
                      Complete profile
                    </Button>
                  </Alert>
                ) : (
                  <form onSubmit={send} className={styles.composerForm}>
                    <Field label={staff ? "Reply to customer" : "Message the Morgan expert"} hideLabel>
                      <Textarea
                        rows={2}
                        value={draft}
                        onChange={(event) => {
                          setDraft(event.target.value);
                          setStatus("");
                        }}
                        onKeyDown={onComposerKeyDown}
                        placeholder={staff ? "Write a reply…" : "Ask a follow-up…"}
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
              title={requests.length ? "Choose a chat" : "No chats yet"}
              description={
                requests.length
                  ? "Select a question from the list."
                  : staff
                    ? "Customer questions for your products appear here."
                    : "Ask Morgan AI, or start a chat with a Morgan expert."
              }
              action={
                !staff && !requests.length ? (
                  <Button href="/questions?mode=expert" variant="accent" size="sm" leading={<Headset size={16} aria-hidden="true" />}>
                    Start chat
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
