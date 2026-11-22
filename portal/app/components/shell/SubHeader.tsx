"use client";

import Link from "next/link";
import { Suspense } from "react";
import { ChevronLeft, ChevronRight, Menu } from "../Icon";
import { cx } from "../ui";
import { getBreadcrumbs } from "./navigation";
import SearchBar from "./SearchBar";
import styles from "./Shell.module.css";

type Props = { pathname: string; menuOpen: boolean; onToggleMenu: () => void };

/** Bar under the header: menu toggle and breadcrumbs on the left, search in the centre. */
export default function SubHeader({ pathname, menuOpen, onToggleMenu }: Props) {
  const crumbs = getBreadcrumbs(pathname);
  return (
    <div className={styles.subHeader}>
      <div className={styles.subHeaderStart}>
      <button
        type="button"
        className={cx(styles.menuToggle, menuOpen && styles.menuToggleOpen)}
        onClick={onToggleMenu}
        aria-expanded={menuOpen}
        aria-controls="main-navigation"
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        title={menuOpen ? "Close menu" : "Open menu"}
      >
        <Menu size={18} aria-hidden="true" />
        <span className={styles.menuLabel}>Menu</span>
        {menuOpen ? <ChevronLeft size={16} aria-hidden="true" /> : <ChevronRight size={16} aria-hidden="true" />}
      </button>
      <span className={styles.menuDivider} aria-hidden="true" />
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <ol>
          {crumbs.map((crumb, index) => (
            <li key={`${crumb.label}-${index}`}>
              {index > 0 && (
                <ChevronRight className={styles.crumbSeparator} size={14} aria-hidden="true" />
              )}
              {crumb.href ? <Link href={crumb.href}>{crumb.label}</Link> : <span aria-current="page">{crumb.label}</span>}
            </li>
          ))}
        </ol>
      </nav>
      </div>
      <div className={styles.searchSlot}>
        <Suspense fallback={<div className={styles.searchPlaceholder} />}>
          <SearchBar highlight={pathname === "/"} />
        </Suspense>
      </div>
    </div>
  );
}
