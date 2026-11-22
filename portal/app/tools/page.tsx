import type { Metadata } from "next";
import { Calculator } from "@/app/components/Icon";
import { Grid, Page, PageHeader } from "@/app/components/ui";
import { CatalogCard } from "@/app/components/catalog/CatalogCard";
import { tools } from "@/app/lib/mock-data";

export const metadata: Metadata = { title: "Tools" };

export default function ToolsPage() {
  return (
    <Page>
      <PageHeader eyebrow="Technical support" title="Tools" description="Calculators, finders and certificate searches to support product selection and specification." />
      <Grid as="ul" min={260}>
        {tools.map((tool) => (
          <li key={tool.slug}>
            <CatalogCard
              href={`/tools/${tool.slug}`}
              headingLevel="h2"
              icon={<Calculator size={20} aria-hidden="true" />}
              tags={tool.restricted ? [tool.type, "Profile required"] : [tool.type]}
              title={tool.title}
              description={tool.description}
              cta={`Open ${tool.title}`}
            />
          </li>
        ))}
      </Grid>
    </Page>
  );
}
