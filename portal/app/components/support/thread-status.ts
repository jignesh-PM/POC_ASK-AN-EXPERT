import type { SearchRoutingRequest } from "@/app/lib/expert-routing";

type BadgeTone = "neutral" | "brand" | "accent" | "success" | "danger" | "warning";

/** Customer-facing label and badge tone for a support thread. */
export function threadStatus(request: Pick<SearchRoutingRequest, "status">): { label: string; tone: BadgeTone } {
  switch (request.status) {
    case "Resolved":
      return { label: "Resolved", tone: "success" };
    case "In live chat":
      return { label: "Expert replied", tone: "brand" };
    case "Expert follow-up requested":
      return { label: "Awaiting expert", tone: "accent" };
    default:
      return { label: "Morgan AI answer", tone: "neutral" };
  }
}

const timeFormat = new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" });
const dateFormat = new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short" });
const yearFormat = new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", year: "numeric" });

/** "Today, 14:05", "Yesterday, 09:12", "3 Nov, 16:40" or "3 Nov 2025". */
export function formatTimestamp(iso: string, withTime = true) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const now = new Date();
  const startOfDay = (value: Date) => new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
  const days = Math.round((startOfDay(now) - startOfDay(date)) / 86_400_000);
  const day = days === 0 ? "Today" : days === 1 ? "Yesterday" : date.getFullYear() === now.getFullYear() ? dateFormat.format(date) : yearFormat.format(date);
  return withTime ? `${day}, ${timeFormat.format(date)}` : day;
}
