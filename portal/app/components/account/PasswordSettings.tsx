"use client";

import { useState, type FormEvent } from "react";
import { Eye, EyeOff, ShieldCheck } from "../Icon";
import { Alert, Button, Card, Field, Input, SectionHeader } from "../ui";
import styles from "./Account.module.css";

type Feedback = { tone: "success" | "danger"; text: string } | null;

/** Password change form (prototype: nothing is stored). */
export default function PasswordSettings() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [visible, setVisible] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const type = visible ? "text" : "password";

  const edit = (setter: (value: string) => void) => (event: { target: { value: string } }) => {
    setter(event.target.value);
    setFeedback(null);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (next !== confirm) return setFeedback({ tone: "danger", text: "The new passwords don’t match." });
    if (current === next) return setFeedback({ tone: "danger", text: "Choose a password different from your current one." });
    setFeedback({ tone: "success", text: "Password change requested." });
    setCurrent("");
    setNext("");
    setConfirm("");
  };

  return (
    <Card as="section" id="password-reset" aria-labelledby="password-heading" padding="lg">
      <div className={styles.cardHead}>
        <SectionHeader
          id="password-heading"
          title="Password"
          className={styles.cardHeadCopy}
          actions={
            <Button variant="ghost" size="sm" aria-pressed={visible} onClick={() => setVisible((value) => !value)} leading={visible ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}>
              Show
            </Button>
          }
        />
      </div>

      <form className={styles.form} onSubmit={submit}>
        <Field label="Current password">
          <Input type={type} autoComplete="current-password" value={current} onChange={edit(setCurrent)} required />
        </Field>
        <div className={styles.fields}>
          <Field label="New password" hint="Use at least 12 characters.">
            <Input type={type} autoComplete="new-password" minLength={12} value={next} onChange={edit(setNext)} required />
          </Field>
          <Field label="Confirm new password">
            <Input type={type} autoComplete="new-password" minLength={12} value={confirm} onChange={edit(setConfirm)} required />
          </Field>
        </div>
        {feedback && <Alert tone={feedback.tone}>{feedback.text}</Alert>}
        <div className={styles.formFooter}>
          <span className={styles.note}>
            <ShieldCheck size={16} aria-hidden="true" /> Prototype: passwords are not saved.
          </span>
          <Button type="submit" variant="secondary">
            Update password
          </Button>
        </div>
      </form>
    </Card>
  );
}
