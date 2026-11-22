import { Suspense } from "react";
import { Page, PageHeader } from "@/app/components/ui";
import ExpertWorkspace from "@/app/components/support/ExpertWorkspace";

export const metadata = { title: "Expert conversations" };

export default function ExpertPage() {
  return (
    // ExpertWorkspace reads `?request=` with useSearchParams, which needs a Suspense boundary.
    <Suspense
      fallback={
        <Page width="wide" aria-busy="true">
          <PageHeader eyebrow="Morgan expert support" title="Expert conversations" description="Loading conversations…" />
        </Page>
      }
    >
      <ExpertWorkspace />
    </Suspense>
  );
}
