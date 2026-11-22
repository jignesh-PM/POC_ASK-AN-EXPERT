"use client";

import { Boxes, FileText, Users } from "@/app/components/Icon";
import { Button, Grid, Stat } from "@/app/components/ui";
import { useRoutingRequests } from "@/app/lib/expert-routing";
import { useAnalyticsEvents, useAuditLog } from "@/app/lib/session";
import { AdminPanel } from "./AdminPanel";
import { AuditList } from "./AuditList";
import { BreakdownChart } from "./BreakdownChart";
import { questionsByProductLine, useAdminUsers } from "./admin-store";

export function OverviewView() {
  const users = useAdminUsers();
  const requests = useRoutingRequests();
  const events = useAnalyticsEvents();
  const audit = useAuditLog();
  const breakdown = questionsByProductLine(requests);

  return (
    <>
      <Grid min={200}>
        <Stat label="Managed accounts" value={users.length} hint={`${users.filter((user) => user.active).length} active`} />
        <Stat label="Product questions" value={requests.length} hint={`Across ${breakdown.filter((item) => item.count).length} product lines`} />
        <Stat label="Open conversations" value={requests.filter((request) => request.status !== "Resolved").length} hint="Awaiting expert resolution" />
        <Stat label="Portal activity" value={events.length} hint={`${events.filter((event) => event.type === "tool_view").length} tool visits recorded`} />
      </Grid>

      <AdminPanel id="admin-quick-actions" title="Quick actions" description="Jump to the most common admin tasks.">
        <Grid min={200} gap={3}>
          <Button href="/admin?view=users" variant="secondary" leading={<Users size={18} aria-hidden="true" />}>
            Manage users
          </Button>
          <Button href="/admin?view=experts" variant="secondary" leading={<Boxes size={18} aria-hidden="true" />}>
            Route expert teams
          </Button>
          <Button href="/admin?view=content" variant="secondary" leading={<FileText size={18} aria-hidden="true" />}>
            Review indexed content
          </Button>
        </Grid>
      </AdminPanel>

      <Grid min={340} gap={6}>
        <AdminPanel id="admin-overview-questions" title="Questions by product line">
          <BreakdownChart rows={breakdown} label="Questions by product line" />
        </AdminPanel>
        <AdminPanel
          id="admin-overview-audit"
          title="Recent admin actions"
          actions={
            <Button href="/admin?view=settings" variant="link" size="sm">
              View audit log
            </Button>
          }
        >
          <AuditList events={audit} limit={5} />
        </AdminPanel>
      </Grid>
    </>
  );
}
