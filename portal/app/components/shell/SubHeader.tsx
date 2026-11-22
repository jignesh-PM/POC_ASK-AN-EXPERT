"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUp, ChevronRight, Headset, Sparkles } from "../Icon";
import { Button, cx } from "../ui";
import { industries, products } from "../../lib/mock-data";
import { getSearchContext, saveSearchRoutingRequest } from "../../lib/expert-routing";
import { STORAGE_KEYS, useStoredString, writeString } from "../../lib/storage";
import { SUPPORT_COMPOSER_ID } from "../../lib/support-mode";
import { getBreadcrumbs } from "./navigation";
import styles from "./Shell.module.css";

export default function SubHeader({ pathname }: { pathname: string }) {
  const crumbs = getBreadcrumbs(pathname);
  return (
    <div className={styles.subHeader}>
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <ol>
          {crumbs.map((crumb, index) => (
            <li key={`${crumb.label}-${index}`}>
              {index > 0 && <ChevronRight size={14} aria-hidden="true" />}
              {crumb.href ? <Link href={crumb.href}>{crumb.label}</Link> : <span aria-current="page">{crumb.label}</span>}
            </li>
          ))}
        </ol>
      </nav>
      <SearchBar pathname={pathname} />
      {pathname !== "/questions" && (
        <Button href="/questions?mode=expert" variant="accent" className={styles.expertCta} leading={<Headset size={18} aria-hidden="true" />}>
          Talk to an expert
        </Button>
      )}
    </div>
  );
}

/**
 * Sticky search shared by every page. Every question gets a Morgan AI answer
 * with its sources (documents and products) on /search; from there the visitor
 * can continue with a human expert if the answer is not enough.
 */
function SearchBar({ pathname }: { pathname: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [query, setQuery] = useState("");
  const industryId = useStoredString(STORAGE_KEYS.searchIndustry) || params.get("industry") || "";
  const productId = useStoredString(STORAGE_KEYS.searchProduct) || params.get("product") || "";
  const industryProducts = industryId ? products.filter((product) => product.industryIds.includes(industryId)) : [];
  const ready = Boolean(query.trim() && industryId && productId);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = query.trim();
    if (!ready) return;
    setQuery("");
    saveSearchRoutingRequest(text, industryId, productId);
    const team = getSearchContext(industryId, productId).expertTeam;
    router.push(`/search?${new URLSearchParams({ q: text, industry: industryId, product: productId, team })}`);
  };

  return (
    <form className={cx(styles.composer, pathname === "/" && styles.composerHighlight)} onSubmit={submit} role="search" aria-label="Ask Morgan">
      <Sparkles className={styles.composerIcon} size={18} aria-hidden="true" />
      <input
        id={SUPPORT_COMPOSER_ID}
        className={styles.composerInput}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Ask about a product, datasheet or application…"
        aria-label="Ask a product or technical question"
        autoComplete="off"
      />
      <select
        className={styles.contextSelect}
        aria-label="Industry"
        value={industryId}
        onChange={(event) => {
          writeString(STORAGE_KEYS.searchIndustry, event.target.value);
          writeString(STORAGE_KEYS.searchProduct, null);
        }}
      >
        <option value="">Industry</option>
        {industries.map((industry) => (
          <option key={industry.id} value={industry.id}>
            {industry.name}
          </option>
        ))}
      </select>
      <select className={styles.contextSelect} aria-label="Product" value={productId} disabled={!industryId} onChange={(event) => writeString(STORAGE_KEYS.searchProduct, event.target.value)}>
        <option value="">Product</option>
        {industryProducts.map((product) => (
          <option key={product.id} value={product.id}>
            {product.name}
          </option>
        ))}
      </select>
      <button type="submit" className={styles.sendButton} disabled={!ready} aria-label="Search" title={ready ? "Search" : "Add a question, then choose an industry and product"}>
        <ArrowUp size={18} aria-hidden="true" />
      </button>
    </form>
  );
}
