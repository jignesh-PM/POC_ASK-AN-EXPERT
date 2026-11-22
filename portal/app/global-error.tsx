"use client";

import "./globals.css";
import ErrorFallback from "./components/ErrorFallback";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body><ErrorFallback code="500" reset={reset} /></body>
    </html>
  );
}
