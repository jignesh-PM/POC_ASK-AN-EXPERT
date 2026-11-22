import { ArrowLeft, Headset } from "@/app/components/Icon";
import { Button, Page, PageHeader } from "@/app/components/ui";
import MyQuestions from "@/app/components/support/MyQuestions";
import RequireSignIn from "@/app/components/support/RequireSignIn";

export const metadata = { title: "My questions" };

export default function MyQuestionsPage() {
  return (
    <Page>
      <PageHeader
        title="My questions"
        description="Every question you’ve asked: Morgan AI answers with their sources, and your conversations with Morgan experts."
        actions={
          <>
            <Button href="/profile" variant="secondary" leading={<ArrowLeft size={16} aria-hidden="true" />}>
              My profile
            </Button>
            <Button href="/questions?mode=expert" variant="accent" leading={<Headset size={16} aria-hidden="true" />}>
              New expert chat
            </Button>
          </>
        }
      />
      <RequireSignIn next="/profile/questions">
        <MyQuestions />
      </RequireSignIn>
    </Page>
  );
}
