import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "@/app/components/Icon";
import { Badge, Card, IconTile } from "@/app/components/ui";
import styles from "./CatalogCard.module.css";

type CatalogCardProps = {
  href: string;
  title: string;
  description?: string;
  /** Icon shown in a tinted tile at the top left. */
  icon?: ReactNode;
  /** Short labels such as range, document type or access level. The first one is highlighted. */
  tags?: string[];
  /** Call-to-action text at the bottom of the card, e.g. "Explore range". */
  cta: string;
  /** Opens in a new tab and shows an external-link arrow. */
  external?: boolean;
  headingLevel?: "h2" | "h3";
  animate?: boolean;
};

/**
 * The one card pattern for browsable catalogue items (ranges, products,
 * documents, tools, support areas). The whole card is the link.
 */
export function CatalogCard({ href, title, description, icon, tags = [], cta, external, headingLevel: Heading = "h3", animate }: CatalogCardProps) {
  return (
    <Card href={href} external={external} animate={animate} className={styles.card}>
      {(icon || tags.length > 0) && (
        <div className={styles.top}>
          {icon && <IconTile>{icon}</IconTile>}
          {tags.length > 0 && (
            <div className={styles.tags}>
              {tags.map((tag, index) => (
                <Badge key={tag} tone={index === 0 ? "brand" : "neutral"}>
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}
      <Heading className={styles.title}>{title}</Heading>
      {description && <p className={styles.description}>{description}</p>}
      <span className={styles.cta}>
        {cta}
        {external ? <ArrowUpRight size={15} aria-hidden="true" /> : <ArrowRight size={15} aria-hidden="true" />}
        {external && <span className="visually-hidden"> (opens in a new tab)</span>}
      </span>
    </Card>
  );
}
