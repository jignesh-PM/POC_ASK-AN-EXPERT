"use client";

import "./globals.css";
import ErrorFallback from "./components/ErrorFallback";
import { roboto } from "./lib/fonts";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en" className={roboto.variable}>
      <body><ErrorFallback code="500" reset={reset} /></body>
    </html>
  );
}
