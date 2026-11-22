import { Page, PageHeader } from "@/app/components/ui";
import SignInForm from "@/app/components/account/SignInForm";

export const metadata = { title: "Sign in" };

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const toExpertChat = Boolean(next?.startsWith("/questions") || next?.startsWith("/expert"));
  return (
    <Page width="narrow">
      <PageHeader
        title="Sign in"
        description={
          toExpertChat
            ? "Sign in to chat with a Morgan expert. We’ll bring you back to your question."
            : "Access your questions, chats and Morgan expert support."
        }
      />
      <SignInForm returnTo={next} />
    </Page>
  );
}
