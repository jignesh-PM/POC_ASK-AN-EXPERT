import { ShieldCheck } from "../Icon";
import { Badge } from "../ui";
import styles from "./ContextBadges.module.css";

/** Industry, product and expert-team chips shown under support page titles. */
export function ContextBadges({ industry, product, team, teamPrefix = "Expert team" }: { industry?: string; product?: string; team?: string; teamPrefix?: string }) {
  if (!industry && !product && !team) return null;
  return (
    <ul className={styles.row} aria-label="Question context">
      {industry && (
        <li>
          <Badge tone="brand">{industry}</Badge>
        </li>
      )}
      {product && (
        <li>
          <Badge tone="brand">{product}</Badge>
        </li>
      )}
      {team && (
        <li>
          <Badge>
            <ShieldCheck size={12} aria-hidden="true" />
            {teamPrefix} · {team}
          </Badge>
        </li>
      )}
    </ul>
  );
}
