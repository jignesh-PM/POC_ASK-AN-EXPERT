"use client";

import ErrorFallback from "./components/shell/ErrorFallback";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorFallback code="500" reset={reset} />;
}
