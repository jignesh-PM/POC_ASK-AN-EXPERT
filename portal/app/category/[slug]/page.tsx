import Link from "next/link";
import { categories, documents } from "../../lib/mock-data";

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug) || categories[0];
  return (
    <main>
      <header className="category-hero"><p>PRODUCT CATEGORY</p><h1>{category.name}</h1><p>{category.description}</p></header>
      <section className="category-page"><div className="resource-tabs"><Link className="active" href="#resources">All resources</Link><Link href="#resources">Datasheets</Link><Link href="#resources">Installation manuals</Link><Link href="#resources">Certificates</Link><Link href="#resources">Technical papers</Link></div><div className="resource-layout"><div id="resources" className="resource-list">{documents.concat(documents.slice(0,2)).map((doc,i)=><article key={`${doc.title}-${i}`}><div className="doc-icon">PDF</div><div><h3>{doc.title}</h3><p>{doc.type} · {doc.line} · Updated {doc.updated}</p></div><Link href="/documents" aria-label={`View ${doc.title}`}>View</Link></article>)}</div><aside className="category-aside"><h3>Need specific advice?</h3><p>Ask Morgan&apos;s {category.name} experts. The first response is from AI, with human support one click away.</p><Link href="/questions">Ask about this category</Link></aside></div></section>
    </main>
  );
}
