import { FileText } from "@/app/components/Icon";
import { Grid } from "@/app/components/ui";
import type { IndexedResource } from "@/app/lib/site-index";
import { CatalogCard } from "./CatalogCard";

/** Grid of technical documents that open on the official Morgan site. */
export function DocumentGrid({ documents, showCategory = true }: { documents: IndexedResource[]; showCategory?: boolean }) {
  return (
    <Grid as="ul" min={300}>
      {documents.map((resource) => (
        <li key={resource.id}>
          <CatalogCard
            href={resource.url}
            external
            icon={<FileText size={20} aria-hidden="true" />}
            tags={showCategory ? [resource.type, resource.category] : [resource.type]}
            title={resource.title}
            description={resource.summary}
            cta="View source document"
          />
        </li>
      ))}
    </Grid>
  );
}
