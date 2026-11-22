import type { Metadata } from "next";
import ErrorFallback from "./components/shell/ErrorFallback";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return <ErrorFallback code="404" />;
}
