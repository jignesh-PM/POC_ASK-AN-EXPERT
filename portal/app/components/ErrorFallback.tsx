"use client";

import { AlertTriangle, ArrowLeft, FileQuestion, RefreshCw } from "lucide-react";
import styles from "./ErrorFallback.module.css";

type ErrorFallbackProps = {
  code: "404" | "500";
  reset?: () => void;
};

export default function ErrorFallback({ code, reset }: ErrorFallbackProps) {
  const notFound = code === "404";
  const Icon = notFound ? FileQuestion : AlertTriangle;

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={`${styles.icon} ${notFound ? styles.notFound : styles.serverError}`}><Icon size={26} strokeWidth={1.8} aria-hidden="true" /></div>
        <p className={styles.code}>{code} · {notFound ? "PAGE NOT FOUND" : "TEMPORARY ERROR"}</p>
        <h1>{notFound ? "We can’t find that page." : "Something went wrong."}</h1>
        <p className={styles.message}>{notFound ? "The link may be outdated, or the page may have moved. Use the links below to continue." : "The portal couldn’t complete that request. You can try again or return to the overview."}</p>
        <div className={styles.actions}>
          {reset && <button type="button" onClick={reset}><RefreshCw size={15} aria-hidden="true" /> Try again</button>}
          <a href="/"><ArrowLeft size={15} aria-hidden="true" /> Portal overview</a>
          <a className={styles.secondary} href="/technical-documents">Technical Documents</a>
        </div>
        <span className={styles.reference}>Morgan Ask the Expert</span>
      </section>
    </main>
  );
}
