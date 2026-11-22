"use client";

import { celebrate } from "@/app/lib/celebrate";
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
    celebrate(document.activeElement);
    router.push(`/expert?request=${encodeURIComponent(requestId)}`);
  };

  return (
    <Stack gap={6}>
      <section className={chat.transcript} aria-label="Your question">
        <ChatBubble author="customer" name="You" align="end">
          {query}
        </ChatBubble>
        <ChatBubble author="expert" name={`Morgan expert · ${expertTeam}`}>
          Your question is ready for a specialist. Add any application details that will help.
        </ChatBubble>
      </section>

      <Card as="form" onSubmit={send} aria-label="Send to expert">
        <Field label="Details" optional hint="Your question, industry and product are included.">
          <Textarea rows={4} value={details} onChange={(event) => setDetails(event.target.value)} placeholder="Temperature, operating conditions, dimensions, what you’ve tried" />
        </Field>
        <div className={styles.footer}>
          <span className={styles.note}>
            <ShieldCheck size={16} aria-hidden="true" /> Replies appear in your expert chat.
          </span>
          <Button type="submit" disabled={sending} trailing={<Send size={16} aria-hidden="true" />}>
            {sending ? "Sending…" : "Send to expert"}
          </Button>
        </div>
      </Card>
    </Stack>
  );
}
