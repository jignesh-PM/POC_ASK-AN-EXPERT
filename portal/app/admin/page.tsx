import type { Metadata } from "next";
import { Suspense } from "react";
import AdminWorkspace from "../components/admin/AdminWorkspace";
import { findAdminView } from "../components/admin/views";
import { Page, PageHeader } from "../components/ui";

export const metadata: Metadata = {
  title: "Admin workspace",
  description: "Manage users, expert routing, content, analytics and settings.",
};

export default function AdminPage({ searchParams }: PageProps<"/admin">) {
  return (
    <Page width="wide">
      <Suspense fallback={<PageHeader title="Admin workspace" />}>
        <AdminView searchParams={searchParams} />
      </Suspense>
    </Page>
  );
}

/** Reads `?view=` on the server so the heading and active section are correct on first paint. */
async function AdminView({ searchParams }: Pick<PageProps<"/admin">, "searchParams">) {
  const view = findAdminView((await searchParams).view);
  return (
    <>
      <PageHeader title={view.label} description={view.description} />
      <AdminWorkspace view={view.id} />
    </>
  );
}
