import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "@/app/components/Icon";
import { Button, Page, PageHeader } from "@/app/components/ui";
import { CategoryResources } from "@/app/components/catalog/CategoryResources";
import { ProductCommunity } from "@/app/components/catalog/ProductCommunity";
import { CalloutCard } from "@/app/components/catalog/CalloutCard";
import { categories } from "@/app/lib/mock-data";

type Props = { params: Promise<{ slug: string }> };

function findCategory(slug: string) {
  return categories.find((item) => item.slug === slug);
}

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = findCategory((await params).slug);
  return category ? { title: category.name, description: category.description } : {};
}

export default async function CategoryPage({ params }: Props) {
  const category = findCategory((await params).slug);
  if (!category) notFound();

  return (
    <Page>
      <PageHeader
        title={category.name}
        description={category.description}
        actions={
          <Button href="/categories" variant="secondary" leading={<ArrowLeft size={16} aria-hidden="true" />}>
            All products
          </Button>
        }
      />
      <CategoryResources category={category} />
      <ProductCommunity category={category} />
      <CalloutCard
        title="Need help choosing a product?"
        description="Tell us your industry and application, and the right specialist will reply."
        action={
          <Button href="/questions?mode=expert" variant="accent" trailing={<ArrowRight size={16} aria-hidden="true" />}>
            Ask a Morgan expert
          </Button>
        }
      />
    </Page>
  );
}
