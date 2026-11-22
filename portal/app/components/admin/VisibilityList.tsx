import type { ReactNode } from "react";
import { IconTile, Switch } from "@/app/components/ui";
import styles from "./VisibilityList.module.css";

/** List of records whose customer visibility can be switched on or off. */
export function VisibilityList({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <ul className={styles.list} aria-label={label}>
      {children}
    </ul>
  );
}

type RowProps = {
  icon?: ReactNode;
  title: ReactNode;
  /** Plain-text name used in the switch's accessible label. */
  name: string;
  description?: ReactNode;
  /** Links, inputs or badges shown under the description. */
  children?: ReactNode;
  visible: boolean;
  onToggle: () => void;
};

export function VisibilityRow({ icon, title, name, description, children, visible, onToggle }: RowProps) {
  return (
    <li className={styles.row}>
      {icon && <IconTile size="sm">{icon}</IconTile>}
      <div className={styles.copy}>
        <strong className={styles.title}>{title}</strong>
        {description && <p className={styles.description}>{description}</p>}
        {children && <div className={styles.extra}>{children}</div>}
      </div>
      <Switch className={styles.toggle} label={visible ? "Visible" : "Hidden"} checked={visible} onChange={onToggle} aria-label={`Show ${name} to customers`} />
    </li>
  );
}
