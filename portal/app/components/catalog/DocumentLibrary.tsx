"use client";

import { useState } from "react";
import { Search } from "@/app/components/Icon";
import { Button, EmptyState, Field, SearchInput, SectionHeader, Select, Stack } from "@/app/components/ui";
import { categories } from "@/app/lib/mock-data";
import { DocumentGrid } from "./DocumentGrid";
import { FilterBar, ResultCount } from "./FilterBar";
import { matchesQuery, useVisibleDocuments } from "./catalog-data";

const ALL = "all";

/** Searchable technical library: official documents plus admin-published sources. */
export function DocumentLibrary() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState(ALL);
  const [range, setRange] = useState(ALL);
  const documents = useVisibleDocuments();

  const types = Array.from(new Set(documents.map((resource) => resource.type)));
  const rangeName = categories.find((category) => category.slug === range)?.name.toLowerCase();
  const results = documents.filter(
    (resource) =>
      (type === ALL || resource.type === type) &&
      (range === ALL || resource.category.toLowerCase() === rangeName) &&
      matchesQuery(query, resource.title, resource.summary, resource.category, ...resource.keywords),
  );
  const clearFilters = () => {
    setQuery("");
    setType(ALL);
    setRange(ALL);
  };

  return (
    <Stack as="section" gap={6} aria-labelledby="document-results-title">
      <FilterBar label="Filter documents">
        <Field label="Search documents" hideLabel>
          <SearchInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by title, product or topic" />
        </Field>
        <Field label="Document type" hideLabel>
          <Select value={type} onChange={(event) => setType(event.target.value)}>
            <option value={ALL}>All document types</option>
            {types.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Product range" hideLabel>
          <Select value={range} onChange={(event) => setRange(event.target.value)}>
            <option value={ALL}>All product ranges</option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </Select>
        </Field>
      </FilterBar>

      <SectionHeader id="document-results-title" title="Documents" actions={<ResultCount count={results.length} noun="document" />} />

      {results.length ? (
        <DocumentGrid documents={results} />
      ) : (
        <EmptyState
          icon={<Search size={22} aria-hidden="true" />}
          title="No documents found"
          description="Try another search or filter."
          action={
            <Button variant="secondary" onClick={clearFilters}>
              Clear filters
            </Button>
          }
        />
      )}
    </Stack>
  );
}
