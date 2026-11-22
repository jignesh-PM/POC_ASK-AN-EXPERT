"use client";

import { Activity, Download, MessageSquareText } from "@/app/components/Icon";
import { Alert, Badge, Button, EmptyState, Grid, Stat } from "@/app/components/ui";
import { useRoutingRequests, type SearchRoutingRequest } from "@/app/lib/expert-routing";
import { useAnalyticsEvents, type PortalEvent } from "@/app/lib/session";
import { AdminPanel } from "./AdminPanel";
import { AdminTable, CellNote } from "./AdminTable";
import { BreakdownChart } from "./BreakdownChart";
import { formatDateTime, questionsByProductLine } from "./admin-store";
import styles from "./AnalyticsView.module.css";

const RECENT_LIMIT = 30;

const EVENT_LABELS: Record<PortalEvent["type"], string> = {
  page_view: "Page view",
  tool_view: "Tool visit",
  product_view: "Product view",
  official_link: "Official link",
  download: "Download",
};

function downloadQuestionsCsv(requests: SearchRoutingRequest[]) {
  const rows = [
    ["Question", "Product line", "Product", "Industry", "Status", "Created"],
    ...requests.map((request) => [request.query, request.category, request.product, request.industry, request.status ?? "Open", request.createdAt]),
  ];
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "morgan-question-report.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

export function AnalyticsView() {
  const requests = useRoutingRequests();
  const events = useAnalyticsEvents();
  const resolved = requests.filter((request) => request.status === "Resolved").length;

  return (
    <>
      <Grid min={180}>
        <Stat label="Questions received" value={requests.length} />
        <Stat label="Waiting for expert" value={requests.length - resolved} />
        <Stat label="Resolved" value={resolved} />
        <Stat label="Portal events" value={events.length} />
      </Grid>

      <AdminPanel
        id="admin-question-report"
        title="Questions by product line"
        actions={
          <Button variant="secondary" onClick={() => downloadQuestionsCsv(requests)} disabled={!requests.length} leading={<Download size={16} aria-hidden="true" />}>
            Export CSV
          </Button>
        }
      >
        <BreakdownChart rows={questionsByProductLine(requests)} label="Questions by product line" />
      </AdminPanel>

      <AdminPanel id="admin-recent-questions" title="Recent questions" description={`Latest ${RECENT_LIMIT}.`}>
        {requests.length ? (
          <AdminTable caption="Recent questions">
            <thead>
              <tr>
                <th scope="col">Question</th>
                <th scope="col">Product</th>
                <th scope="col">Industry</th>
                <th scope="col">Status</th>
                <th scope="col">Asked</th>
              </tr>
            </thead>
            <tbody>
              {requests.slice(0, RECENT_LIMIT).map((request) => (
                <tr key={request.id}>
                  <td className={styles.question}>{request.query}</td>
                  <td>
                    {request.product || "Not specified"}
                    <CellNote>{request.category}</CellNote>
                  </td>
                  <td>{request.industry || "—"}</td>
                  <td>
                    <Badge tone={request.status === "Resolved" ? "success" : "accent"}>{request.status ?? "Open"}</Badge>
                  </td>
                  <td className={styles.nowrap}>
                    <time dateTime={request.createdAt}>{new Date(request.createdAt).toLocaleDateString()}</time>
                  </td>
                </tr>
              ))}
            </tbody>
          </AdminTable>
        ) : (
          <EmptyState icon={<MessageSquareText size={22} />} title="No questions yet" description="Customer questions appear here." />
        )}
      </AdminPanel>

      <AdminPanel id="admin-recent-activity" title="Recent activity" description={`Latest ${RECENT_LIMIT} page and tool events.`}>
        {events.length ? (
          <AdminTable caption="Recent activity">
            <thead>
              <tr>
                <th scope="col">Event</th>
                <th scope="col">Path</th>
                <th scope="col">Role</th>
                <th scope="col">Region / language</th>
                <th scope="col">When</th>
              </tr>
            </thead>
            <tbody>
              {events.slice(0, RECENT_LIMIT).map((event, index) => (
                <tr key={`${event.at}-${index}`}>
                  <td className={styles.nowrap}>{EVENT_LABELS[event.type] ?? event.type}</td>
                  <td>
                    <code className={styles.path}>{event.path}</code>
                    {event.target && <CellNote>{event.target}</CellNote>}
                  </td>
                  <td>{event.role}</td>
                  <td>
                    {event.region} · {event.language}
                  </td>
                  <td className={styles.nowrap}>
                    <time dateTime={event.at}>{formatDateTime(event.at)}</time>
                  </td>
                </tr>
              ))}
            </tbody>
          </AdminTable>
        ) : (
          <EmptyState icon={<Activity size={22} />} title="No activity yet" description="Page and tool visits appear here." />
        )}
      </AdminPanel>

      <Alert>Prototype: analytics are recorded in this browser only.</Alert>
    </>
  );
}
