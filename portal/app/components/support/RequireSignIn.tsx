"use client";

import type { ReactNode } from "react";
import { Headset, LogIn } from "../Icon";
import { Button, Card } from "../ui";
import { useRole } from "@/app/lib/session";
import { useHydrated } from "@/app/lib/storage";
import { MascotOr } from "../mascot/Mascot";
import styles from "./RequireSignIn.module.css";

/** Link to sign-in that returns to `next` afterwards. */
export function signInHref(next: string) {
  return `/sign-in?${new URLSearchParams({ next })}`;
}

/**
 * Expert chat is for signed-in users only. Visitors see a sign-in prompt that
 * brings them back to `next` (the chat they were starting) after signing in.
 */
export default function RequireSignIn({ next, children }: { next: string; children: ReactNode }) {
  const role = useRole();
  const hydrated = useHydrated();

  // The role lives in browser storage, so wait for it rather than flashing the prompt.
  if (!hydrated) return <div className={styles.placeholder} aria-busy="true" />;
  if (role !== "Visitor") return <>{children}</>;

  return (
    <Card padding="lg" className={styles.card} animate>
      <MascotOr
        mood="wave"
        size="md"
        fallback={
          <span className={styles.icon} aria-hidden="true">
            <Headset size={26} />
          </span>
        }
      />
      <h2 className={styles.title}>Sign in to chat with an expert</h2>
      <p className={styles.text}>
        Your chats are saved to your account, so you can pick them up any time. Morgan AI answers don’t need an account.
      </p>
      <div className={styles.actions}>
        <Button href={signInHref(next)} variant="accent" leading={<LogIn size={16} aria-hidden="true" />}>
          Sign in
        </Button>
        <Button href={signInHref(next)} variant="secondary">
          Create an account
        </Button>
      </div>
    </Card>
  );
}
