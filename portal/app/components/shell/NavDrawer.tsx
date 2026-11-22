"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Icon, X } from "../Icon";
import { cx } from "../ui";
import { isStaff, roleHome, useRole } from "../../lib/session";
import { NAV_ITEMS, type NavItem } from "./navigation";
import styles from "./Shell.module.css";

/** Off-canvas main navigation. Closes on Escape, backdrop click or link click. */
export default function NavDrawer({ open, pathname, onClose }: { open: boolean; pathname: string; onClose: () => void }) {
  const role = useRole();
  const panelRef = useRef<HTMLElement>(null);
  const home: NavItem = isStaff(role)
    ? { href: roleHome(role), label: "Dashboard", description: "Your workspace and assigned activity", icon: "grid", match: (p) => p === roleHome(role) }
    : { href: "/", label: "Home", description: "Browse resources and get support", icon: "grid", match: (p) => p === "/" };

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      <div className={cx(styles.backdrop, open && styles.backdropVisible)} onClick={onClose} aria-hidden="true" />
      <aside id="main-navigation" ref={panelRef} className={cx(styles.drawer, open && styles.drawerOpen)} aria-label="Main navigation" inert={!open}>
        <div className={styles.drawerHeader}>
          <span>Menu</span>
          <button type="button" className={styles.iconButtonLight} onClick={onClose} aria-label="Close navigation">
            <X size={20} aria-hidden="true" />
          </button>
        </div>
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
    </>
  );
}
