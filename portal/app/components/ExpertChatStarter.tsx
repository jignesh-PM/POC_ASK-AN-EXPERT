"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Headset, Send, ShieldCheck } from "@/app/components/Icon";
import { industries, products } from "../lib/mock-data";
import { saveSearchRoutingRequest, submitExpertFollowUp } from "../lib/expert-routing";

export default function ExpertChatStarter() {
  const router = useRouter();
  const [industryId, setIndustryId] = useState("");
  const [productId, setProductId] = useState("");
  const [question, setQuestion] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const industryProducts = useMemo(() => products.filter((product) => !industryId || product.industryIds.includes(industryId)), [industryId]);
  const contextLabel = industries.find((industry) => industry.id === industryId)?.name;
  const send = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!industryId || !productId || !question.trim()) { setError("Choose an industry and product, then add your question."); return; }
    setSending(true);
    const requestId = saveSearchRoutingRequest(question, industryId, productId);
    submitExpertFollowUp(question, industryId, productId, "Direct chat requested with a Morgan subject matter expert.");
    if (requestId) router.push(`/expert?request=${encodeURIComponent(requestId)}`);
    else setSending(false);
  };

  return <main className="expert-chat-starter">
    <header><span><Headset size={20} aria-hidden="true" /></span><div><p>HUMAN EXPERT SUPPORT</p><h1>Start an expert chat</h1><small>A subject matter expert will reply in this conversation. This chat is separate from Morgan AI answers.</small></div></header>
    <form onSubmit={send}>
      <label>Your question<textarea rows={4} value={question} onChange={(event) => { setQuestion(event.target.value); setError(""); }} placeholder="Describe your product or application questionâ€¦" /></label>
      <div className="expert-chat-starter-context"><label>Industry<select value={industryId} onChange={(event) => { setIndustryId(event.target.value); setProductId(""); }}><option value="">Choose industry</option>{industries.map((industry) => <option value={industry.id} key={industry.id}>{industry.name}</option>)}</select></label><label>Product line<select value={productId} onChange={(event) => setProductId(event.target.value)} disabled={!industryId}><option value="">Choose product</option>{industryProducts.map((product) => <option value={product.id} key={product.id}>{product.categoryName} Â· {product.name}</option>)}</select></label></div>
      {error && <p role="alert" className="product-community-error">{error}</p>}
      <footer><span><ShieldCheck size={14} aria-hidden="true" /> Routed to the matching Morgan team{contextLabel ? ` for ${contextLabel}` : ""}.</span><button type="submit" disabled={sending}>{sending ? "Opening chatâ€¦" : "Start expert chat"}<Send size={14} aria-hidden="true" /></button></footer>
    </form>
    <Link className="expert-chat-starter-back" href="/questions"><ArrowRight size={14} aria-hidden="true" /> Browse product community threads</Link>
  </main>;
}