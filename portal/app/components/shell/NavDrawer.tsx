"use client";

import Link from "next/link";
import { useEffect, useRef, type RefObject } from "react";
import { Icon } from "../Icon";
import { cx } from "../ui";
import { isStaff, roleHome, useRole } from "../../lib/session";
import { NAV_ITEMS, type NavItem } from "./navigation";
import styles from "./Shell.module.css";

type Props = { open: boolean; pathname: string; onClose: () => void; headerRef: RefObject<HTMLElement | null> };

/**
 * Main navigation drawer. It opens *below* the site header so the logo, menu
 * toggle and search stay visible. Closes on Escape, backdrop click or link click.
 */
export default function NavDrawer({ open, pathname, onClose, headerRef }: Props) {
  const role = useRole();
  const rootRef = useRef<HTMLDivElement>(null);
  const home: NavItem = isStaff(role)
    ? { href: roleHome(role), label: "Dashboard", description: "Your workspace and assigned activity", icon: "grid", match: (p) => p === roleHome(role) }
    : { href: "/", label: "Home", description: "Browse resources and get support", icon: "grid", match: (p) => p === "/" };

  // Keep the drawer's top edge pinned to the bottom of the (sticky or scrolling) header.
  useEffect(() => {
    if (!open) return;
    const root = rootRef.current;
    const place = () => {
      const bottom = Math.max(0, headerRef.current?.getBoundingClientRect().bottom ?? 0);
      root?.style.setProperty("--drawer-top", `${bottom}px`);
    };
    place();
    root?.querySelector<HTMLElement>("nav a")?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", place, { passive: true });
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", place);
      window.removeEventListener("resize", place);
    };
  }, [open, onClose, headerRef]);

  return (
    <div ref={rootRef}>
      <div className={cx(styles.backdrop, open && styles.backdropVisible)} onClick={onClose} aria-hidden="true" />
      <aside id="main-navigation" className={cx(styles.drawer, open && styles.drawerOpen)} aria-label="Main navigation" inert={!open}>
        <nav>
          <ul className={styles.navList}>
            {[home, ...NAV_ITEMS].map((item) => {
              const active = item.match(pathname);
              return (
                <li key={item.href}>
                  <Link href={item.href} className={cx(styles.navLink, active && styles.navLinkActive)} aria-current={active ? "page" : undefined} onClick={onClose}>
                    <Icon name={item.icon} size={20} aria-hidden="true" />
                    <span>
                      <strong>{item.label}</strong>
                      <small>{item.description}</small>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </div>
  );
}
