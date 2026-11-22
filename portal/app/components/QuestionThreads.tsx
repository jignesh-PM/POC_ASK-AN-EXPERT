"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock3, Headset, MessageSquareText } from "@/app/components/Icon";
import { expertRoutingStorageKey, type SearchRoutingRequest } from "../lib/expert-routing";

function getThreadHref(request: SearchRoutingRequest) {
  if (request.status === "Expert follow-up requested" || request.status === "In live chat" || request.status === "Resolved") return `/expert?request=${encodeURIComponent(request.id)}`;
  const params = new URLSearchParams({ q: request.query, industry: request.industryId, product: request.productId, team: request.expertTeam });
  return `/search?${params.toString()}`;
}

export default function QuestionThreads() {
  const [requests, setRequests] = useState<SearchRoutingRequest[]>([]);
  useEffect(() => {
    const sync = () => {
      try { setRequests(JSON.parse(window.localStorage.getItem(expertRoutingStorageKey) || "[]") as SearchRoutingRequest[]); }
      catch { setRequests([]); }
    };
    sync();
    window.addEventListener("morgan-search-routing-updated", sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener("morgan-search-routing-updated", sync); window.removeEventListener("storage", sync); };
  }, []);

  return <main className="talk-expert-hub"><header className="talk-expert-hub-header"><span className="talk-expert-hub-icon"><Headset size={21} aria-hidden="true" /></span><div><p>CHOOSE A SUPPORT CHAT</p><h1>Get product help</h1><span>Use Morgan AI for a quick answer, or start a separate chat with a product specialist.</span></div><div className="talk-expert-hub-actions"><Link href="/categories">Ask Morgan AI <ArrowRight size={15} aria-hidden="true" /></Link><Link href="/questions?mode=expert" onClick={() => window.dispatchEvent(new CustomEvent("morgan-support-mode-change", { detail: "expert" }))}>Talk to an expert <ArrowRight size={15} aria-hidden="true" /></Link></div></header>
    <section className="talk-expert-thread-section" aria-labelledby="talk-expert-threads-title"><div className="talk-expert-thread-heading"><div><p>PRODUCT COMMUNITY</p><h2 id="talk-expert-threads-title">Recent product threads</h2></div><span>{requests.length} threads</span></div>
      {requests.length ? <div className="talk-expert-thread-list">{requests.slice(0, 12).map((request) => <Link className="talk-expert-thread-card" href={getThreadHref(request)} key={request.id}><span className="talk-expert-thread-icon"><MessageSquareText size={17} aria-hidden="true" /></span><span className="talk-expert-thread-copy"><strong>{request.query}</strong><span>{request.industry} Â· {request.product} Â· {request.expertTeam}</span><small>{request.status === "Resolved" ? "Resolved expert chat" : request.status === "Expert follow-up requested" || request.status === "In live chat" ? "Expert chat started" : "Morgan AI answer available"}</small></span><time><Clock3 size={12} aria-hidden="true" />{new Date(request.createdAt).toLocaleDateString()}</time><ArrowRight className="talk-expert-thread-arrow" size={15} aria-hidden="true" /></Link>)}</div> : <div className="talk-expert-empty"><span><MessageSquareText size={20} aria-hidden="true" /></span><strong>No conversations yet</strong><p>Browse product threads for Morgan AI answers, or open a separate expert chat from the header.</p><Link href="/categories">Browse product lines <ArrowRight size={14} aria-hidden="true" /></Link></div>}
    </section>
  </main>;
}