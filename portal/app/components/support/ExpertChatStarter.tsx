"use client";

import { celebrate } from "@/app/lib/celebrate";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, ShieldCheck } from "../Icon";
import { Alert, Button, Card, Field, Select, Textarea } from "../ui";
import styles from "./SupportForm.module.css";
import { industries, products } from "@/app/lib/mock-data";
import { submitExpertFollowUp } from "@/app/lib/expert-routing";

/** Direct expert chat: question plus industry and product line for routing. */
export default function ExpertChatStarter() {
  const router = useRouter();
  const [industryId, setIndustryId] = useState("");
  const [productId, setProductId] = useState("");
  const [question, setQuestion] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const industryProducts = products.filter((product) => !industryId || product.industryIds.includes(industryId));
  const industryName = industries.find((industry) => industry.id === industryId)?.name;

  const send = (event: { preventDefault(): void }) => {
    event.preventDefault();
    if (!industryId || !productId || !question.trim()) {
      setError("Add your question, industry and product.");
      return;
    }
    setSending(true);
    const requestId = submitExpertFollowUp(question, industryId, productId, "Direct chat requested with a Morgan subject matter expert.");
    celebrate(document.activeElement);
    router.push(`/expert?request=${encodeURIComponent(requestId)}`);
  };

  return (
    <>
      <Card as="form" onSubmit={send} aria-label="Start expert chat">
        <Field label="Your question">
          <Textarea
            rows={4}
            value={question}
            onChange={(event) => {
              setQuestion(event.target.value);
              setError("");
            }}
            placeholder="Describe your product or application question"
            aria-required="true"
          />
        </Field>
        <div className={styles.columns}>
          <Field label="Industry">
            <Select
              value={industryId}
              onChange={(event) => {
                setIndustryId(event.target.value);
                setProductId("");
                setError("");
              }}
              aria-required="true"
            >
              <option value="">Choose industry</option>
              {industries.map((industry) => (
                <option value={industry.id} key={industry.id}>
                  {industry.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Product" hint={industryId ? undefined : "Choose an industry first."}>
            <Select
              value={productId}
              onChange={(event) => {
                setProductId(event.target.value);
                setError("");
              }}
              disabled={!industryId}
              aria-required="true"
            >
              <option value="">Choose product</option>
              {industryProducts.map((product) => (
                <option value={product.id} key={product.id}>
                  {product.categoryName} · {product.name}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        {error && <Alert tone="danger">{error}</Alert>}
        <div className={styles.footer}>
          <span className={styles.note}>
            <ShieldCheck size={16} aria-hidden="true" /> Sent to the right Morgan specialist{industryName ? ` for ${industryName}` : ""}.
          </span>
          <Button type="submit" disabled={sending} trailing={<Send size={16} aria-hidden="true" />}>
            {sending ? "Opening chat…" : "Start expert chat"}
          </Button>
        </div>
      </Card>
      <Button href="/questions" variant="link" className={styles.backLink} leading={<ArrowLeft size={14} aria-hidden="true" />}>
        Back to questions
      </Button>
    </>
  );
}
