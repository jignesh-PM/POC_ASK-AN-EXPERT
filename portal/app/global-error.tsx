"use client";

import { roboto } from "./lib/fonts";
import { themeInitScript } from "./lib/theme-script";
import "./styles/tokens.css";
import "./styles/base.css";
import ErrorFallback from "./components/shell/ErrorFallback";

/** Replaces the root layout when it fails, so it renders its own <html>. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en" className={roboto.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ErrorFallback code="500" reset={reset} />
      </body>
    </html>
  );
}
