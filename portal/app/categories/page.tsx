"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "@/app/components/Icon";
import { categories, products } from "../lib/mock-data";
import { catalogSettingsUpdatedEvent, getDefaultCatalogSettings, readCatalogSettings } from "../lib/catalog-settings";

export default function CategoriesPage() {
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [catalogSettings, setCatalogSettings] = useState(getDefaultCatalogSettings);
  useEffect(() => {
    const sync = () => setCatalogSettings(readCatalogSettings());
    sync();
    window.addEventListener(catalogSettingsUpdatedEvent, sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener(catalogSettingsUpdatedEvent, sync); window.removeEventListener("storage", sync); };
  }, []);
  const visibleCategories = categories.filter((category) => products.some((product) => product.category === category.slug && !catalogSettings.hiddenProductIds.includes(product.id)));
  const filteredProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    const searchContent = `${product.name} ${product.description} ${categories.find((category) => category.slug === product.category)?.name ?? ""}`.toLowerCase();
    return matchesCategory && !catalogSettings.hiddenProductIds.includes(product.id) && searchContent.includes(query.trim().toLowerCase());
  }), [categoryFilter, catalogSettings.hiddenProductIds, query]);

  return (
    <main className="simple-page product-catalogue-page">
      <div className="simple-head"><p className="eyebrow">PRODUCTS</p><h1>Find your product</h1><p>Explore Morgan Thermal Ceramics product ranges and technical information.</p></div>
      <section className="catalogue-controls" aria-label="Filter products">
        <label className="catalogue-search"><Search size={18} aria-hidden="true" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products and product ranges" aria-label="Search products" /></label>
        <label className="catalogue-category-filter">Product range<select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}><option value="all">All ranges</option>{visibleCategories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}</select></label>
      </section>
      <div className="catalogue-results-heading"><h2>Products and services</h2><span>{filteredProducts.length} results</span></div>
      {filteredProducts.length ? <div className="product-catalogue-grid">{filteredProducts.map((product) => {
        const category = categories.find((item) => item.slug === product.category);
        return <Link className="product-catalogue-card" href={`/category/${product.category}`} key={product.id}><span className="product-card-category">{category?.name ?? "Products"}</span><h3>{product.name}</h3><p>{product.description}</p><b>View product range <ArrowRight size={14} aria-hidden="true" /></b></Link>;
      })}</div> : <div className="catalogue-empty"><Search size={22} aria-hidden="true" /><h3>No products found</h3><p>Try a different product name or select another range.</p><button type="button" onClick={() => { setQuery(""); setCategoryFilter("all"); }}>Clear filters</button></div>}
      <section className="catalogue-range-links"><div><h2>Browse by range</h2><p>Start with a product family to see related products and documents.</p></div><div>{visibleCategories.map((category) => <Link key={category.slug} href={`/category/${category.slug}`}>{category.name}<ArrowRight size={14} aria-hidden="true" /></Link>)}</div></section>
    </main>
  );
}
