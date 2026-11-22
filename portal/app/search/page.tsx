import SearchResults from "../components/SearchResults";

export const instant = false;

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; industry?: string; product?: string; team?: string }> }) {
  const { q = "", industry = "", product = "", team = "" } = await searchParams;
  return <SearchResults query={q} industryId={industry} productId={product} expertTeam={team} />;
}
