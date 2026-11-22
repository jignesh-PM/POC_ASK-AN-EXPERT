"use client";

import { Suspense, useCallback, useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { STORAGE_KEYS, readString } from "../../lib/storage";
import { readAdminSettings, readRole, trackEvent, type PortalEvent } from "../../lib/session";
import TopBar from "./TopBar";
import NavDrawer from "./NavDrawer";
import SubHeader from "./SubHeader";
import styles from "./Shell.module.css";

const OFFICIAL_HOSTS = new Set(["www.morganthermalceramics.com", "morganthermalceramics.com"]);

function currentContext() {
  const settings = readAdminSettings();
  return {
    role: readRole(),
    region: readString(STORAGE_KEYS.region) || settings.defaultRegion,
    language: readString(STORAGE_KEYS.language) || settings.defaultLanguage,
  };
}

/** Records page views and clicks on official Morgan links for the admin analytics view. */
function usePortalAnalytics(pathname: string) {
  useEffect(() => {
    trackEvent({ type: pathname.startsWith("/tools/") ? "tool_view" : "page_view", path: pathname, ...currentContext() });
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!anchor) return;
      const destination = new URL(anchor.href, window.location.href);
      const isDownload = anchor.hasAttribute("download");
      if (!isDownload && !OFFICIAL_HOSTS.has(destination.hostname)) return;
      const type: PortalEvent["type"] = isDownload ? "download" : destination.pathname.includes("products-systems") ? "product_view" : "official_link";
      trackEvent({ type, path: window.location.pathname, target: destination.href, ...currentContext() });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
}

export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  usePortalAnalytics(pathname);

  return (
    <>
      <a className={styles.skipLink} href="#main-content">
        Skip to content
      </a>
      <header className={styles.header}>
        <TopBar menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((open) => !open)} />
        <Suspense fallback={<div className={styles.subheaderPlaceholder} />}>
          <SubHeader pathname={pathname} />
        </Suspense>
      </header>
      <NavDrawer open={menuOpen} pathname={pathname} onClose={closeMenu} />
      <div id="main-content" className={styles.content}>
        {children}
      </div>
    </>
  );
}
