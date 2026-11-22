import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@/app/components/Icon";
import { Badge, Button, Page, PageHeader } from "@/app/components/ui";
import { ToolRunner } from "@/app/components/catalog/ToolRunner";
import { tools } from "@/app/lib/mock-data";

type Props = { params: Promise<{ slug: string }> };

function findTool(slug: string) {
  return tools.find((item) => item.slug === slug);
}

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tool = findTool((await params).slug);
  return tool ? { title: tool.title, description: tool.description } : {};
}

export default async function ToolPage({ params }: Props) {
  const tool = findTool((await params).slug);
  if (!tool) notFound();

  return (
    <Page width="narrow">
      <PageHeader
        title={tool.title}
        description={tool.description}
        actions={
          <Button href="/tools" variant="ghost" size="sm" leading={<ArrowLeft size={15} aria-hidden="true" />}>
            All tools
          </Button>
        }
      >
        <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
          <Badge tone="brand">{tool.type}</Badge>
          {tool.restricted && <Badge tone="warning">Profile required</Badge>}
        </div>
      </PageHeader>
      <ToolRunner slug={tool.slug} restricted={Boolean(tool.restricted)} />
    </Page>
  );
}
