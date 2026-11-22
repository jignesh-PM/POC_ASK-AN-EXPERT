import { ArrowLeft } from "@/app/components/Icon";
import { Button, Page, PageHeader } from "@/app/components/ui";
import { ContextBadges } from "@/app/components/support/ContextBadges";
import ExpertChatStarter from "@/app/components/support/ExpertChatStarter";
import QuestionIntake from "@/app/components/support/QuestionIntake";
import QuestionThreads, { SupportHubActions } from "@/app/components/support/QuestionThreads";
import RequireSignIn from "@/app/components/support/RequireSignIn";
import { industries, products } from "@/app/lib/mock-data";

export const metadata = { title: "Get product help" };

type SearchParams = { q?: string; industry?: string; product?: string; team?: string; mode?: string };

export default async function QuestionsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { q = "", industry = "", product = "", team = "", mode = "" } = await searchParams;

  if (q && industry && product) {
    const productInfo = products.find((item) => item.id === product);
    const assignedTeam = team || productInfo?.expertTeam || "Morgan technical support";
    const backHref = `/search?${new URLSearchParams({ q, industry, product, team: assignedTeam })}`;
    return (
      <Page width="narrow">
        <Button href={backHref} variant="link" size="sm" leading={<ArrowLeft size={14} aria-hidden="true" />}>
          Back to Morgan AI answer
        </Button>
        <PageHeader title="Talk with a Morgan expert" description={`A subject matter expert from the ${assignedTeam} will reply in this conversation.`}>
          <ContextBadges industry={industries.find((item) => item.id === industry)?.name} product={productInfo?.name} team={assignedTeam} teamPrefix="Routed to" />
        </PageHeader>
        <RequireSignIn next={`/questions?${new URLSearchParams({ q, industry, product, team: assignedTeam })}`}>
          <QuestionIntake query={q} industryId={industry} productId={product} expertTeam={assignedTeam} />
        </RequireSignIn>
      </Page>
    );
  }

  if (mode === "expert") {
    return (
      <Page width="narrow">
        <PageHeader
          title="Start an expert chat"
          description="A Morgan subject matter expert will reply in this conversation. This chat is separate from Morgan AI answers."
        />
        <RequireSignIn next="/questions?mode=expert">
          <ExpertChatStarter />
        </RequireSignIn>
      </Page>
    );
  }

  return (
    <Page>
      <PageHeader
        title="Get product help"
        description="Use Morgan AI for a quick answer, or start a separate chat with a product specialist."
        actions={<SupportHubActions />}
      />
      <QuestionThreads />
    </Page>
  );
}
