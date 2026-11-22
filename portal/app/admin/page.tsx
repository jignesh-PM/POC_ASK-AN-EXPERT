import AdminWorkspace from "../components/AdminWorkspace";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const { view = "overview" } = await searchParams;
  return <AdminWorkspace view={view} />;
}
