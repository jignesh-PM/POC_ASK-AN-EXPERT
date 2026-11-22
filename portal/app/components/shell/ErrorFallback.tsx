"use client";

import { ArrowLeft, RefreshCw } from "../Icon";
import { Button, Badge } from "../ui";
import Mascot from "../mascot/Mascot";
import styles from "./StatusPage.module.css";

/** Shared body for not-found and error boundaries. */
export default function ErrorFallback({ code, reset }: { code: "404" | "500"; reset?: () => void }) {
  const notFound = code === "404";
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <Mascot mood={notFound ? "curious" : "oops"} size="md" />
        <Badge tone={notFound ? "accent" : "danger"}>{notFound ? "Error 404" : "Error"}</Badge>
        <h1 className={styles.title}>{notFound ? "Page not found" : "Something went wrong"}</h1>
        <p className={styles.message}>{notFound ? "This page may have moved." : "Please try again."}</p>
        <div className={styles.actions}>
          {reset && (
            <Button onClick={reset} leading={<RefreshCw size={16} aria-hidden="true" />}>
              Try again
            </Button>
          )}
          <Button href="/" variant={reset ? "secondary" : "primary"} leading={<ArrowLeft size={16} aria-hidden="true" />}>
            Home
          </Button>
          {notFound && (
            <Button href="/sitemap" variant="secondary">
              Site map
            </Button>
          )}
        </div>
      </section>
    </main>
  );
}
