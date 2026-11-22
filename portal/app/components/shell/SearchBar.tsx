"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUp, Search } from "../Icon";
import { cx } from "../ui";
import { industries, products } from "../../lib/mock-data";
import { getSearchContext, saveSearchRoutingRequest } from "../../lib/expert-routing";
import { STORAGE_KEYS, useStoredString, writeString } from "../../lib/storage";
import { SUPPORT_COMPOSER_ID } from "../../lib/support-mode";
import styles from "./Shell.module.css";

/**
 * Header search shared by every page. Every question gets a Morgan AI answer
 * with its sources (documents and products) on /search; from there the visitor
 * can continue with a human expert if the answer is not enough.
 */
export default function SearchBar({ highlight }: { highlight?: boolean }) {
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
    <form className={cx(styles.search, highlight && styles.searchHighlight)} onSubmit={submit} role="search" aria-label="Ask Morgan">
      <label className={styles.searchQuery}>
        <Search size={18} aria-hidden="true" />
        <input
          id={SUPPORT_COMPOSER_ID}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ask about a product, datasheet or application…"
          aria-label="Ask a product or technical question"
          autoComplete="off"
        />
      </label>
      <div className={styles.searchContext}>
        <select
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
        <select aria-label="Product" value={productId} disabled={!industryId} onChange={(event) => writeString(STORAGE_KEYS.searchProduct, event.target.value)}>
          <option value="">Product</option>
          {industryProducts.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
        <button type="submit" className={cx(styles.sendButton, ready && styles.sendReady)} disabled={!ready} aria-label="Search" title={ready ? "Search" : "Add a question, then choose an industry and product"}>
          <ArrowUp size={18} aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
