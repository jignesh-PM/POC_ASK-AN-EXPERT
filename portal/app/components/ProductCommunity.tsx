"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, MessageSquareText, Send } from "@/app/components/Icon";
import { industries, products } from "../lib/mock-data";
import { expertRoutingStorageKey, getSearchContext, saveSearchRoutingRequest, type SearchRoutingRequest } from "../lib/expert-routing";

const messageKey = "morgan-expert-conversation-messages";

export default function ProductCommunity({ categoryId, categoryName }: { categoryId: string; categoryName: string }) {
  const router = useRouter();
  const categoryProducts = useMemo(() => products.filter((product) => product.category === categoryId), [categoryId]);
  const [requests, setRequests] = useState<SearchRoutingRequest[]>([]);
  const [productId, setProductId] = useState(categoryProducts[0]?.id ?? "");
  const [industryId, setIndustryId] = useState("");
  const [question, setQuestion] = useState("");
  const [replyCounts, setReplyCounts] = useState<Record<string, number>>({});
  const [error, setError] = useState("");
  const availableProducts = useMemo(() => categoryProducts.filter((product) => !industryId || product.industryIds.includes(industryId)), [categoryProducts, industryId]);

  useEffect(() => {
    const sync = () => {
      try { setRequests(JSON.parse(window.localStorage.getItem(expertRoutingStorageKey) || "[]") as SearchRoutingRequest[]); }
      catch { setRequests([]); }
      try {
        const messages = JSON.parse(window.localStorage.getItem(messageKey) || "{}") as Record<string, unknown[]>;
        setReplyCounts(Object.fromEntries(Object.entries(messages).map(([id, list]) => [id, list.length])));
      } catch { setReplyCounts({}); }
    };
    sync();
    window.addEventListener("morgan-search-routing-updated", sync);
    window.addEventListener("morgan-chat-message-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("morgan-search-routing-updated", sync);
      window.removeEventListener("morgan-chat-message-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const threads = requests.filter((request) => request.category === categoryName && request.productId);
  const submitQuestion = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!industryId) { setError("Choose an industry so the right product team can respond."); return; }
    if (!question.trim()) { setError("Write a question to start the thread."); return; }
    const id = saveSearchRoutingRequest(question, industryId, productId);
    if (id) {
      const team = getSearchContext(industryId, productId).expertTeam;
      const params = new URLSearchParams({ q: question.trim(), industry: industryId, product: productId, team });
      router.push(`/search?${params.toString()}`);
    }
  };

  return <section className="product-community" aria-labelledby="product-community-title">
    <header className="product-community-heading"><div><p>PRODUCT COMMUNITY</p><h2 id="product-community-title">Questions about {categoryName}</h2><span>Ask a question or learn from conversations already started by customers and visitors.</span></div><span className="product-community-count"><MessageSquareText size={15} aria-hidden="true" />{threads.length} threads</span></header>
    <form className="product-community-form" onSubmit={submitQuestion}>
      <label className="product-community-question"><span>Your question</span><textarea rows={3} value={question} onChange={(event) => { setQuestion(event.target.value); setError(""); }} placeholder={`Ask a product or application question about ${categoryName}â€¦`} /></label>
      <div className="product-community-form-row"><label><span>Product</span><select value={productId} onChange={(event) => setProductId(event.target.value)}>{availableProducts.map((product) => <option value={product.id} key={product.id}>{product.name}</option>)}</select></label><label><span>Industry</span><select value={industryId} onChange={(event) => { const nextIndustry = event.target.value; const nextProducts = categoryProducts.filter((product) => !nextIndustry || product.industryIds.includes(nextIndustry)); if (!nextProducts.some((product) => product.id === productId)) setProductId(nextProducts[0]?.id ?? ""); setIndustryId(nextIndustry); setError(""); }}><option value="">Choose an industry</option>{industries.map((industry) => <option value={industry.id} key={industry.id}>{industry.name}</option>)}</select></label><button type="submit" disabled={!question.trim() || !productId}><Send size={15} aria-hidden="true" />Ask Morgan AI</button></div>
      {error && <p className="product-community-error" role="alert">{error}</p>}
      <p className="product-community-note">Your question appears in this product community and gets an answer from Morgan product and document knowledge. You can start a separate expert chat from the answer.</p>
    </form>
    <div className="product-community-threads" aria-label={`${categoryName} question threads`}>
      {threads.length ? threads.map((thread) => { const expertStarted = thread.status === "Expert follow-up requested" || thread.status === "In live chat" || thread.status === "Resolved"; const threadParams = new URLSearchParams({ q: thread.query, industry: thread.industryId, product: thread.productId, team: thread.expertTeam }); return <article className="product-community-thread" key={thread.id}><span className="product-community-thread-icon"><MessageSquareText size={17} aria-hidden="true" /></span><div><h3>{thread.query}</h3><p>{thread.product} <span>Â·</span> {thread.industry} <span>Â·</span> {thread.expertTeam}</p><small>{expertStarted ? thread.status === "Resolved" ? "Resolved expert chat" : "Expert chat started" : "Morgan AI answer available"} <span>Â·</span> {replyCounts[thread.id] ?? 0} replies</small></div><Link href={expertStarted ? `/expert?request=${encodeURIComponent(thread.id)}` : `/search?${threadParams.toString()}`}>{expertStarted ? "Open expert chat" : "View AI answer"} <ArrowRight size={14} aria-hidden="true" /></Link></article>; }) : <div className="product-community-empty"><MessageSquareText size={19} aria-hidden="true" /><strong>Be the first to ask</strong><span>New questions appear here for everyone exploring {categoryName}.</span></div>}
    </div>
  </section>;
}