"use client";

import { useState } from "react";
import { ArrowRight, Download, ShieldCheck, Trash2 } from "../Icon";
import { Alert, Button, Card, IconTile, SectionHeader } from "../ui";
import styles from "./Account.module.css";

/** Privacy consent summary with data export and deletion requests (prototype acknowledgements only). */
export default function DataConsentCard() {
  const [message, setMessage] = useState("");

  return (
    <Card as="section" aria-labelledby="data-consent-heading" padding="lg">
      <div className={styles.cardHead}>
        <IconTile>
          <ShieldCheck size={20} />
        </IconTile>
        <SectionHeader id="data-consent-heading" title="Data & consent" description="Privacy notice accepted on 21 November 2026." className={styles.cardHeadCopy} />
      </div>
      <Button href="/privacy" variant="link" trailing={<ArrowRight size={14} aria-hidden="true" />} className={styles.inlineLink}>
        Review privacy notice
      </Button>
      <div className={styles.actions}>
        <Button variant="secondary" size="sm" leading={<Download size={16} aria-hidden="true" />} onClick={() => setMessage("Data export requested. A copy of your data will be emailed to you.")}>
          Request data export
        </Button>
        <Button variant="danger" size="sm" leading={<Trash2 size={16} aria-hidden="true" />} onClick={() => setMessage("Account deletion requested. Morgan's privacy team will confirm by email.")}>
          Request account deletion
        </Button>
      </div>
      {message && <Alert tone="success">{message}</Alert>}
    </Card>
  );
}
