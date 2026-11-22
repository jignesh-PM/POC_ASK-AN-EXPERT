"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, Clock3, Headset, MessageSquareText, Search, Send, ShieldCheck, UserRound } from "@/app/components/Icon";
import { expertRoutingStorageKey, type SearchRoutingRequest } from "../lib/expert-routing";
import { getProfileCompletion, readProfileDetails } from "../lib/profile-completion";
import { products } from "../lib/mock-data";

type ChatMessage = { id: string; sender: "customer" | "expert"; text: string; createdAt: string };
type DemoThread = { id: string; query: string; industry: string; product: string; category: string; expertTeam: string; createdAt: string; status: string; details?: string };
const messagesStorageKey = "morgan-expert-conversation-messages";

export default function ExpertConversationWorkspace() {
  const [role, setRole] = useState("Visitor");
  const [requests, setRequests] = useState<SearchRoutingRequest[]>([]);
  const [activeId, setActiveId] = useState("");
  const [requestedThreadId, setRequestedThreadId] = useState("");
  const [messagesByThread, setMessagesByThread] = useState<Record<string, ChatMessage[]>>({});
  const [filter, setFilter] = useState("");
  const [draft, setDraft] = useState("");
  const [justSent, setJustSent] = useState(false);
  const [profileRequired, setProfileRequired] = useState(false);
  const [assignedProductLines, setAssignedProductLines] = useState<string[] | null>(null);
  const isExpert = role === "Morgan User" || role === "Super Admin";

  useEffect(() => {
    const sync = () => {
      const currentRole = window.localStorage.getItem("prototype-role") || "Visitor";
      setRole(currentRole);
      if (currentRole === "Morgan User") {
        const email = window.localStorage.getItem("morgan-profile-email")?.toLowerCase();
        let managed: { email: string; role: string; active: boolean; productLines: string[] }[] = [];
        try { managed = JSON.parse(window.localStorage.getItem("morgan-admin-users") || "[]"); } catch { managed = []; }
        const account = managed.find((user) => user.email.toLowerCase() === email && user.role === "Morgan User" && user.active);
        setAssignedProductLines(account?.productLines ?? []);
      } else setAssignedProductLines(null);
      let requiresProfile = false;
      try { requiresProfile = (JSON.parse(window.localStorage.getItem("morgan-admin-settings") || "{}") as { requireProfile?: boolean }).requireProfile === true; } catch { requiresProfile = false; }
      setProfileRequired(requiresProfile && !["Morgan User", "Super Admin"].includes(currentRole) && getProfileCompletion(readProfileDetails()).percent < 100);
      try { setRequests(JSON.parse(window.localStorage.getItem(expertRoutingStorageKey) || "[]") as SearchRoutingRequest[]); } catch { setRequests([]); }
      try { setMessagesByThread(JSON.parse(window.localStorage.getItem(messagesStorageKey) || "{}") as Record<string, ChatMessage[]>); } catch { setMessagesByThread({}); }
      const requestedId = new URLSearchParams(window.location.search).get("request");
      if (requestedId) setRequestedThreadId(requestedId);
    };
    sync();
    window.addEventListener("prototype-role-change", sync);
    window.addEventListener("morgan-search-routing-updated", sync);
    window.addEventListener("morgan-chat-message-updated", sync);
    window.addEventListener("morgan-admin-settings-updated", sync);
    window.addEventListener("morgan-admin-audit-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("prototype-role-change", sync);
      window.removeEventListener("morgan-search-routing-updated", sync);
      window.removeEventListener("morgan-chat-message-updated", sync);
      window.removeEventListener("morgan-admin-settings-updated", sync);
      window.removeEventListener("morgan-admin-audit-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const threads = useMemo<DemoThread[]>(() => {
    const routed = requests.map((request) => ({ id: request.id, query: request.query, industry: request.industry, product: request.product, category: request.category, expertTeam: request.expertTeam, createdAt: request.createdAt, status: request.status === "Resolved" ? "Resolved" : request.status === "Expert follow-up requested" ? "Needs reply" : "Open", details: request.details }));
    return routed.filter((thread) => {
      if (role === "Morgan User" && assignedProductLines && !assignedProductLines.includes(products.find((product) => product.id === requests.find((request) => request.id === thread.id)?.productId)?.category ?? "")) return false;
      return `${thread.query} ${thread.industry} ${thread.product} ${thread.expertTeam}`.toLowerCase().includes(filter.toLowerCase());
    });
  }, [assignedProductLines, filter, requests, role]);

  useEffect(() => {
    if (!threads.length) { setActiveId(""); return; }
    if (requestedThreadId && threads.some((thread) => thread.id === requestedThreadId)) {
      if (activeId !== requestedThreadId) setActiveId(requestedThreadId);
      return;
    }
    if (!threads.some((thread) => thread.id === activeId)) setActiveId(threads[0].id);
  }, [activeId, requestedThreadId, threads]);

  const activeThread = threads.find((thread) => thread.id === activeId);
  useEffect(() => {
    if (!activeId) return;
    window.localStorage.setItem("morgan-active-expert-thread", activeId);
    window.dispatchEvent(new CustomEvent("morgan-support-mode-change", { detail: "expert" }));
  }, [activeId]);
  const initialCustomerMessages: ChatMessage[] = activeThread ? [{ id: `${activeThread.id}-question`, sender: "customer", text: activeThread.query, createdAt: activeThread.createdAt }, ...(activeThread.details ? [{ id: `${activeThread.id}-details`, sender: "customer" as const, text: activeThread.details, createdAt: activeThread.createdAt }] : [])] : [];
  const chatMessages = activeThread ? messagesByThread[activeThread.id] ?? initialCustomerMessages : [];
  const latestMessageFromExpert = chatMessages.at(-1)?.sender === "expert";
  const selectThread = (threadId: string) => {
    setActiveId(threadId);
    setRequestedThreadId(threadId);
    window.history.replaceState(null, "", `/expert?request=${encodeURIComponent(threadId)}`);
    window.dispatchEvent(new CustomEvent("morgan-support-mode-change", { detail: "expert" }));
  };
  const resolveConversation = () => {
    if (!isExpert || !activeThread || activeThread.id.startsWith("sample-")) return;
    const next = requests.map((request) => request.id === activeThread.id ? { ...request, status: "Resolved" as const } : request);
    setRequests(next);
    window.localStorage.setItem(expertRoutingStorageKey, JSON.stringify(next));
    window.dispatchEvent(new Event("morgan-search-routing-updated"));
  };
  const sendReply = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = draft.trim();
    if (!activeThread || !text || profileRequired) return;
    const message: ChatMessage = { id: `message-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, sender: isExpert ? "expert" : "customer", text, createdAt: new Date().toISOString() };
    const nextMessages = { ...messagesByThread, [activeThread.id]: [...chatMessages, message] };
    setMessagesByThread(nextMessages);
    window.localStorage.setItem(messagesStorageKey, JSON.stringify(nextMessages));
    window.dispatchEvent(new Event("morgan-chat-message-updated"));
    if (!isExpert) {
      const nextRequests = requests.map((request) => request.id === activeThread.id ? { ...request, status: "Expert follow-up requested" as const } : request);
      setRequests(nextRequests);
      window.localStorage.setItem(expertRoutingStorageKey, JSON.stringify(nextRequests));
      window.dispatchEvent(new Event("morgan-search-routing-updated"));
    }
    setDraft("");
    setJustSent(true);
    window.setTimeout(() => setJustSent(false), 2200);
  };
  const handleComposerKey = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  return <main className="expert-chat-page">
    <aside className="expert-thread-sidebar" aria-label="Conversations">
      <div className="expert-sidebar-heading"><div><p>{isExpert ? "SUPPORT INBOX" : "PRODUCT COMMUNITY"}</p><h1>{isExpert ? "Customer conversations" : "Community threads"}</h1></div><span>{threads.filter((thread) => thread.status !== "Resolved").length}</span></div>
      <label className="expert-thread-search"><Search size={15} aria-hidden="true" /><input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Find a conversation" aria-label="Find a conversation" /></label>
      <div className="expert-thread-list">{threads.map((thread) => <button type="button" aria-current={thread.id === activeId ? "true" : undefined} className={`expert-thread-option ${thread.id === activeId ? "is-active" : ""}`} onClick={() => selectThread(thread.id)} key={thread.id}><span className="expert-thread-avatar"><UserRound size={16} aria-hidden="true" /></span><span className="expert-thread-copy"><strong>{thread.query}</strong><span>{thread.industry} Â· {thread.product}</span><small>{thread.status} Â· {thread.expertTeam}</small></span><time>{new Date(thread.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time></button>)}{!threads.length && <p className="expert-thread-empty">No conversations match your search.</p>}</div>
      <div className="expert-inbox-note"><ShieldCheck size={14} aria-hidden="true" /><span>Questions are routed to the Morgan team for the selected product.</span></div>
    </aside>
    <section className="expert-chat-panel" aria-label="Conversation">
      {activeThread ? <>
        <header className="expert-chat-header"><span className="expert-chat-header-avatar"><Headset size={18} aria-hidden="true" /></span><div><p>{isExpert ? "CUSTOMER / VISITOR â†” MORGAN EXPERT TEAM" : "MORGAN EXPERT SUPPORT"}</p><h2>{activeThread.query}</h2><span>{activeThread.industry} Â· {activeThread.product} Â· Routed to {activeThread.expertTeam} Â· {activeThread.status}</span></div>{isExpert && !activeThread.id.startsWith("sample-") && activeThread.status !== "Resolved" && <button type="button" className="expert-resolve-button" onClick={resolveConversation}><Check size={14} aria-hidden="true" /><span>Resolve chat</span></button>}</header>
        <div className="expert-chat-transcript" role="log" aria-live="polite" aria-label="Messages between the customer and Morgan expert team">
          <div className="expert-chat-date"><span><MessageSquareText size={13} aria-hidden="true" /> Conversation started</span></div>
          {chatMessages.map((message) => <article className={`expert-chat-message ${message.sender === "customer" ? "from-customer" : "from-expert"}`} key={message.id}><span className="expert-message-avatar">{message.sender === "customer" ? <UserRound size={14} aria-hidden="true" /> : <Headset size={14} aria-hidden="true" />}</span><div className="expert-message-body"><div className="expert-message-byline"><strong>{message.sender === "customer" ? "Customer / visitor" : "Morgan expert team"}</strong><time>{new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time></div><p>{message.text}</p></div></article>)}
          <div className="expert-response-state">{isExpert ? <Headset size={13} aria-hidden="true" /> : latestMessageFromExpert ? <Check size={13} aria-hidden="true" /> : <Clock3 size={13} aria-hidden="true" />}<span>{isExpert ? "Reply as the Morgan subject matter expert." : latestMessageFromExpert ? "Morganâ€™s expert team has replied. Continue the conversation below." : "A Morgan subject matter expert will reply in this conversation."}</span></div>
        </div>
        {profileRequired ? <div className="expert-profile-gate"><ShieldCheck size={17} /><span><strong>Complete your profile to message a Morgan expert.</strong><small>Your question is saved in the {activeThread.category || activeThread.product} community thread.</small></span><Link href="/profile#personal-details">Complete profile</Link></div> : <form className="expert-chat-composer" onSubmit={sendReply}><div className="expert-composer-box"><textarea rows={1} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={handleComposerKey} placeholder={isExpert ? "Write a reply to the customerâ€¦" : "Ask a follow-up questionâ€¦"} aria-label={isExpert ? "Reply to customer" : "Message Morgan expert team"} /><div className="expert-composer-tools"><span>{justSent ? <><Check size={13} /> Message saved</> : "Enter to send Â· Shift + Enter for a new line"}</span><div><button type="submit" className="expert-send-button" disabled={!draft.trim()} aria-label="Send message"><Send size={15} /><span>Send</span></button></div></div></div><p>Conversation messages are saved locally in this prototype.</p></form>}
      </> : <div className="expert-empty-state"><MessageSquareText size={28} /><h2>Choose a conversation</h2><p>Select a customer question to open the conversation.</p></div>}
    </section>
  </main>;
}