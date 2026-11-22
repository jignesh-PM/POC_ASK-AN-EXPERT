import QuestionIntake from "../components/QuestionIntake";
import QuestionThreads from "../components/QuestionThreads";
import ExpertChatStarter from "../components/ExpertChatStarter";

export default async function QuestionsPage({ searchParams }: { searchParams: Promise<{ q?: string; industry?: string; product?: string; team?: string; mode?: string }> }) {
  const { q = "", industry = "", product = "", team = "", mode = "" } = await searchParams;
  if (q && product && industry) return <QuestionIntake query={q} industryId={industry} productId={product} expertTeam={team} />;
  if (mode === "expert") return <ExpertChatStarter />;
  return <QuestionThreads />;
}
