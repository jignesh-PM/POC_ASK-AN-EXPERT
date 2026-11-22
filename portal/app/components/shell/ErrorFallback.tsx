"use client";

import { ArrowLeft, RefreshCw } from "../Icon";
import { Button, Badge } from "../ui";
import styles from "./StatusPage.module.css";

/** Shared body for not-found and error boundaries. */
export default function ErrorFallback({ code, reset }: { code: "404" | "500"; reset?: () => void }) {
  const notFound = code === "404";
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <Badge tone={notFound ? "accent" : "danger"}>{notFound ? "Error 404" : "Error"}</Badge>
        <h1 className={styles.title}>{notFound ? "We can’t find that page." : "That request didn’t complete."}</h1>
        <p className={styles.message}>
          {notFound ? "The link may be outdated, or the page may have moved. Use the links below to continue." : "You can try again, or return to the portal home."}
        </p>
        <div className={styles.actions}>
          {reset && (
            <Button onClick={reset} leading={<RefreshCw size={16} aria-hidden="true" />}>
              Try again
            </Button>
          )}
          <Button href="/" variant={reset ? "secondary" : "primary"} leading={<ArrowLeft size={16} aria-hidden="true" />}>
            Back to home
          </Button>
          {notFound && (
            <Button href="/sitemap" variant="secondary">
              Browse the site map
            </Button>
          )}
        </div>
      </section>
    </main>
  );
}
