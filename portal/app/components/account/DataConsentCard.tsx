"use client";

import { useState } from "react";
import { ArrowRight, Download, Trash2 } from "../Icon";
import { Alert, Button, Card, SectionHeader } from "../ui";
import styles from "./Account.module.css";

/** Privacy consent summary with data export and deletion requests (prototype acknowledgements only). */
export default function DataConsentCard() {
  const [message, setMessage] = useState("");

  return (
    <Card as="section" aria-labelledby="data-consent-heading" padding="lg">
      <div className={styles.cardHead}>
        <SectionHeader id="data-consent-heading" title="Data & consent" description="Privacy notice accepted on 21 November 2026." className={styles.cardHeadCopy} />
      </div>
      <Button href="/privacy" variant="link" trailing={<ArrowRight size={14} aria-hidden="true" />} className={styles.inlineLink}>
        Privacy notice
      </Button>
      <div className={styles.actions}>
        <Button variant="secondary" size="sm" leading={<Download size={16} aria-hidden="true" />} onClick={() => setMessage("Export requested. We’ll email you a copy of your data.")}>
          Export data
        </Button>
        <Button variant="danger" size="sm" leading={<Trash2 size={16} aria-hidden="true" />} onClick={() => setMessage("Deletion requested. Morgan’s privacy team will confirm by email.")}>
          Delete account
        </Button>
      </div>
      {message && <Alert tone="success">{message}</Alert>}
    </Card>
  );
}
