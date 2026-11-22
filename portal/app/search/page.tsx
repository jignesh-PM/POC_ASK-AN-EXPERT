import { Page, PageHeader } from "@/app/components/ui";
import { ContextBadges } from "@/app/components/support/ContextBadges";
import SearchConversation from "@/app/components/support/SearchConversation";
import { industries, products } from "@/app/lib/mock-data";

export const instant = false;

export const metadata = { title: "Answer" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; industry?: string; product?: string; team?: string }> }) {
  const { q = "", industry = "", product = "", team = "" } = await searchParams;

  return (
    <Page>
      <PageHeader
        title="Your answer"
        description="Drawn from Morgan product information and approved documents. Ask a follow-up in the search bar above, or continue with a Morgan expert."
      >
        <ContextBadges industry={industries.find((item) => item.id === industry)?.name} product={products.find((item) => item.id === product)?.name} team={team} />
      </PageHeader>
      <SearchConversation query={q} industryId={industry} productId={product} expertTeam={team} />
    </Page>
  );
}
