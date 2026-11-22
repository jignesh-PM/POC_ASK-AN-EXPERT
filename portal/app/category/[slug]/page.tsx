import CategoryDetail from "../../components/CategoryDetail";
import { categories } from "../../lib/mock-data";

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug) || categories[0];
  return <CategoryDetail category={category} />;
}
