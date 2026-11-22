import { Page, PageHeader } from "@/app/components/ui";
import SignInForm from "@/app/components/account/SignInForm";

export const metadata = { title: "Sign in" };

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const toExpertChat = Boolean(next?.startsWith("/questions") || next?.startsWith("/expert"));
  return (
    <Page width="narrow">
      <PageHeader
        title="Sign in to your account"
        description={
          toExpertChat
            ? "Sign in to chat with a Morgan expert. You’ll return to your question straight after."
            : "Access technical resources, saved conversations and Morgan expert support."
        }
      />
      <SignInForm returnTo={next} />
    </Page>
  );
}
