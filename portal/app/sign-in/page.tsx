import { Page, PageHeader } from "@/app/components/ui";
import SignInForm from "@/app/components/account/SignInForm";

export const metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <Page width="narrow">
      <PageHeader eyebrow="Morgan Ask the Expert" title="Sign in to your account" description="Access technical resources, saved conversations and Morgan expert support." />
      <SignInForm />
    </Page>
  );
}
