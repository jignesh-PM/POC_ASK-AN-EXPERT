"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Headset, Send, ShieldCheck, UserRound } from "@/app/components/Icon";
import { industries, products } from "../lib/mock-data";
import { submitExpertFollowUp } from "../lib/expert-routing";

export default function QuestionIntake({ query, industryId, productId, expertTeam }: { query: string; industryId: string; productId: string; expertTeam: string }) {
  const router = useRouter();
  const [details, setDetails] = useState("");
  const [sending, setSending] = useState(false);
  const industry = industries.find((item) => item.id === industryId);
  const product = products.find((item) => item.id === productId);
  const assignedTeam = expertTeam || product?.expertTeam || "Morgan technical support";

  const sendQuestion = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSending(true);
    const requestId = submitExpertFollowUp(query, industryId, productId, details);
    if (requestId) router.push(`/expert?request=${encodeURIComponent(requestId)}`);
    else setSending(false);
  };

  return <main className="talk-expert-chat-page">
    <div className="talk-expert-chat-heading"><Link href={`/search?q=${encodeURIComponent(query)}&industry=${encodeURIComponent(industryId)}&product=${encodeURIComponent(productId)}&team=${encodeURIComponent(assignedTeam)}`}><ArrowLeft size={14} aria-hidden="true" /> Back to answer</Link><div><p>SEPARATE HUMAN EXPERT CHAT</p><h1>Talk with a Morgan expert</h1><span>A subject matter expert from {assignedTeam} will reply in this conversation.</span></div></div>
    <div className="talk-expert-context"><span>{industry?.name ?? "Industry"}</span><span>{product?.name ?? "Product"}</span><span><ShieldCheck size={13} aria-hidden="true" /> Routed to {assignedTeam}</span></div>
    <section className="talk-expert-transcript" aria-label="Question sent to Morgan expert team">
      <article className="talk-expert-message from-customer"><span className="talk-expert-avatar"><UserRound size={15} aria-hidden="true" /></span><div><small>You</small><p>{query}</p></div></article>
      <article className="talk-expert-message from-team"><span className="talk-expert-avatar"><Headset size={15} aria-hidden="true" /></span><div><small>Morgan expert team Â· {assignedTeam}</small><p>Your question is ready for the right product specialist. Add any application details that could help them respond.</p></div></article>
    </section>
    <form className="talk-expert-composer" onSubmit={sendQuestion}><label htmlFor="expert-follow-up-details">Add details for the expert <span>Optional</span></label><textarea id="expert-follow-up-details" rows={3} value={details} onChange={(event) => setDetails(event.target.value)} placeholder="Operating conditions, temperature, dimensions, or what you have tried" /><div><small>Your industry, product and original question will be included.</small><button type="submit" disabled={sending}>{sending ? "Sendingâ€¦" : "Send to expert team"}<Send size={14} aria-hidden="true" /></button></div></form>
    <p className="talk-expert-prototype-note">Replies appear in this conversation. Messages are saved locally in this prototype.</p>
  </main>;
}