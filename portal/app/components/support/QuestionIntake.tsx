"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, ShieldCheck } from "../Icon";
import { Button, Card, Field, Stack, Textarea } from "../ui";
import { ChatBubble } from "./ChatBubble";
import chat from "./Chat.module.css";
import styles from "./SupportForm.module.css";
import { submitExpertFollowUp } from "@/app/lib/expert-routing";

/** Confirms a Morgan AI question and sends it to the product's expert team. */
export default function QuestionIntake({ query, industryId, productId, expertTeam }: { query: string; industryId: string; productId: string; expertTeam: string }) {
  const router = useRouter();
  const [details, setDetails] = useState("");
  const [sending, setSending] = useState(false);

  const send = (event: { preventDefault(): void }) => {
    event.preventDefault();
    setSending(true);
    const requestId = submitExpertFollowUp(query, industryId, productId, details);
    router.push(`/expert?request=${encodeURIComponent(requestId)}`);
  };

  return (
    <Stack gap={6}>
      <section className={chat.transcript} aria-label="Question for the Morgan expert team">
        <ChatBubble author="customer" name="You" align="end">
          {query}
        </ChatBubble>
        <ChatBubble author="expert" name={`Morgan expert team · ${expertTeam}`}>
          Your question is ready for the right product specialist. Add any application details that could help them respond.
        </ChatBubble>
      </section>

      <Card as="form" onSubmit={send} aria-label="Send your question to an expert">
        <Field label="Add details for the expert" optional hint="Your industry, product and original question are included automatically.">
          <Textarea rows={4} value={details} onChange={(event) => setDetails(event.target.value)} placeholder="Operating conditions, temperature, dimensions, or what you have tried" />
        </Field>
        <div className={styles.footer}>
          <span className={styles.note}>
            <ShieldCheck size={16} aria-hidden="true" /> Replies appear in your expert conversation. Messages are saved in this browser for the prototype.
          </span>
          <Button type="submit" disabled={sending} trailing={<Send size={16} aria-hidden="true" />}>
            {sending ? "Sending…" : "Send to expert team"}
          </Button>
        </div>
      </Card>
    </Stack>
  );
}
