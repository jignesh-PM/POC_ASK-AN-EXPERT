import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Grid, Page, PageHeader } from "@/app/components/ui";
import { CatalogCard } from "@/app/components/catalog/CatalogCard";
import { mainAreas } from "@/app/lib/mock-data";

type Props = { params: Promise<{ slug: string }> };

function findArea(slug: string) {
  return mainAreas.find((item) => item.slug === slug);
}

export function generateStaticParams() {
  return mainAreas.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const area = findArea((await params).slug);
  return area ? { title: area.title, description: area.description } : {};
}

export default async function MainAreaPage({ params }: Props) {
  const area = findArea((await params).slug);
  if (!area) notFound();

  return (
    <Page>
      <PageHeader title={area.title} description={area.description} />
      <Grid as="ul" min={280} aria-label={`${area.title} next steps`}>
        <li>
          <CatalogCard
            href="/documents"
            headingLevel="h2"
            title="Technical resources"
            description="Browse documents and downloads for this area."
            cta="Browse technical documents"
          />
        </li>
        <li>
          <CatalogCard
            href="/questions"
            headingLevel="h2"
            title="Ask an expert"
            description="Start an AI-assisted question or talk to the responding team."
            cta="Ask a question"
          />
        </li>
      </Grid>
    </Page>
  );
}
