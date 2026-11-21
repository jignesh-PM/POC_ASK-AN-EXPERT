import Link from "next/link";
import { categories } from "../lib/mock-data";

export default function CategoriesPage() {
  return (
    <main className="simple-page">
      <div className="simple-head">
        <Link href="/">← Back to portal</Link>
        <p className="eyebrow">EXPLORE</p>
        <h1>Product categories</h1>
      </div>
      <div className="simple-grid">
        {categories.map((category) => (
          <Link
            className="simple-card"
            href={`/category/${category.slug}`}
            key={category.slug}
          >
            <h2>{category.name}</h2>
            <p>{category.description}</p>
            <span>{category.count} resources</span>
            <b>Open category →</b>
          </Link>
        ))}
      </div>
    </main>
  );
}
