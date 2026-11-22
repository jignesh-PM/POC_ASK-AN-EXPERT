"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Boxes, Info, Settings, Phone, Mail, ExternalLink, UserRound, LogIn, LogOut, Grid2X2, Calculator, FileText, Eye, Globe, Languages, ChevronRight, Bell, Check, Sparkles, Menu, X, KeyRound, CircleUserRound, Search, ArrowUp } from "@/app/components/Icon";
import BrandedSelect from "./BrandedSelect";
import AskExpertBadge from "./AskExpertBadge";
import * as DropdownMenu from "./DropdownMenu";
import { getProfileCompletion, profileUpdatedEvent, readProfileDetails } from "../lib/profile-completion";
import { industries, products } from "../lib/mock-data";
import { appendConversationMessage, getSearchContext, saveSearchRoutingRequest, submitExpertFollowUp } from "../lib/expert-routing";
import { observePortalMotion } from "../lib/portal-motion";

function BrandMark() {
  return (
    <Link className="brand-mark reference-brand" href="/" aria-label="Morgan Ask the Expert home">
      <img className="morgan-logo" src="/morgan-logo.png" alt="Morgan Advanced Materials" />
    </Link>
  );
}

function getPageTitle(pathname: string) {
  const titles: Record<string, string> = {
    "/": "Overview",
    "/legal": "Legal",
    "/categories": "Products",
    "/documents": "Documents",
    "/tools": "Tools",
    "/expert": "Expert Desk",
    "/admin": "Admin Portal",
    "/questions": "Talk to an Expert",
    "/profile": "My Profile",
    "/sign-in": "Sign In",
    "/technical-documents": "Technical Documents",
    "/sitemap": "Site Map",
    "/privacy": "Privacy Policy",
    "/terms": "Terms of Use",
  };
  if (titles[pathname]) return titles[pathname];
  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1] ?? "Home";
  return lastSegment.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getBreadcrumbs(pathname: string, pageTitle: string) {
  const segments = pathname.split("/").filter(Boolean);
  if (!segments.length) return [{ label: "Home" }];

  const crumbs: { label: string; href?: string }[] = [{ label: "Home", href: "/" }];
  if (segments.length > 1) {
    const parent = segments[0];
    if (parent === "category") crumbs.push({ label: "Products", href: "/categories" });
    else if (parent === "main-area") crumbs.push({ label: "Main Areas", href: "/" });
    else {
      const parentTitle = getPageTitle(`/${parent}`);
      crumbs.push({ label: parentTitle, href: `/${parent}` });
    }
  } else if (pathname === "/privacy" || pathname === "/terms") {
    crumbs.push({ label: "Legal", href: "/legal" });
  }

  if (crumbs[crumbs.length - 1]?.label !== pageTitle) crumbs.push({ label: pageTitle });
  return crumbs;
}

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [role, setRole] = useState("Visitor");
  const [region, setRegion] = useState("EMEA");
  const [language, setLanguage] = useState("English");
  const [welcomeNotificationUnread, setWelcomeNotificationUnread] = useState(true);
  const [profileCompletion, setProfileCompletion] = useState(100);
  const [utilityMenuOffset, setUtilityMenuOffset] = useState(15);
  const [routeLoading, setRouteLoading] = useState(false);
  const [dockQuery, setDockQuery] = useState("");
  const [dockMode, setDockMode] = useState<"ai" | "expert">("ai");
  const [searchIndustryId, setSearchIndustryId] = useState("");
  const [searchProductId, setSearchProductId] = useState("");
  const routeLoadingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const pageTitle = getPageTitle(pathname);
  const breadcrumbs = getBreadcrumbs(pathname, pageTitle);
  const isProductRoute = pathname.startsWith("/categories") || pathname.startsWith("/category/") || pathname.startsWith("/main-area/");
  const isLegalRoute = pathname === "/legal" || pathname === "/privacy" || pathname === "/terms";

  useEffect(() => {
    const syncRegion = () => {
      let adminDefaults: { defaultRegion?: string; defaultLanguage?: string } = {};
      try { adminDefaults = JSON.parse(window.localStorage.getItem("morgan-admin-settings") || "{}"); } catch { adminDefaults = {}; }
      setRegion(window.localStorage.getItem("morgan-region") || adminDefaults.defaultRegion || "EMEA");
      setLanguage(window.localStorage.getItem("morgan-language") || adminDefaults.defaultLanguage || "English");
    };
    syncRegion();
    window.addEventListener("storage", syncRegion);
    window.addEventListener("morgan-admin-settings-updated", syncRegion);
    return () => { window.removeEventListener("storage", syncRegion); window.removeEventListener("morgan-admin-settings-updated", syncRegion); };
  }, []);

  const changeRegion = (nextRegion: string) => {
    setRegion(nextRegion);
    window.localStorage.setItem("morgan-region", nextRegion);
    window.dispatchEvent(new Event("morgan-region-change"));
  };
  const changeLanguage = (nextLanguage: string) => {
    setLanguage(nextLanguage);
    window.localStorage.setItem("morgan-language", nextLanguage);
  };
  const roleHomeHref = role === "Morgan User" ? "/expert" : role === "Super Admin" ? "/admin" : "/";
  const roleHomeLabel = role === "Morgan User" || role === "Super Admin" ? "Dashboard" : "Home";
  const dockProducts = searchIndustryId ? products.filter((product) => product.industryIds.includes(searchIndustryId)) : [];

  useEffect(() => {
    const syncSearchContext = () => {
      const params = new URLSearchParams(window.location.search);
      const industry = window.localStorage.getItem("morgan-search-industry") || params.get("industry") || "";
      const product = window.localStorage.getItem("morgan-search-product") || params.get("product") || "";
      setSearchIndustryId(industry);
      setSearchProductId(product);
    };
    syncSearchContext();
    window.addEventListener("morgan-search-context-change", syncSearchContext);
    return () => window.removeEventListener("morgan-search-context-change", syncSearchContext);
  }, []);

  useEffect(() => {
    setWelcomeNotificationUnread(window.localStorage.getItem("morgan-welcome-notification-read") !== "true");
  }, []);

  useEffect(() => {
    const page = document.querySelector<HTMLElement>(".chrome-page-content");
    if (!page) return;
    return observePortalMotion(page);
  }, [pathname]);

  const markWelcomeNotificationRead = () => {
    setWelcomeNotificationUnread(false);
    window.localStorage.setItem("morgan-welcome-notification-read", "true");
  };

  useEffect(() => {
    const updateMenuOffset = () => {
      setUtilityMenuOffset(window.innerWidth <= 620 ? 7 : window.innerWidth <= 760 ? 8 : 15);
    };
    updateMenuOffset();
    window.addEventListener("resize", updateMenuOffset);
    return () => window.removeEventListener("resize", updateMenuOffset);
  }, []);

  useEffect(() => {
    const savedRole = window.localStorage.getItem("prototype-role");
    if (savedRole) setRole(savedRole);
    const syncRole = () => {
      setRole(window.localStorage.getItem("prototype-role") || "Visitor");
      setProfileCompletion(getProfileCompletion(readProfileDetails()).percent);
    };
    syncRole();
    window.addEventListener("prototype-role-change", syncRole);
    window.addEventListener(profileUpdatedEvent, syncRole);
    window.addEventListener("storage", syncRole);
    return () => {
      window.removeEventListener("prototype-role-change", syncRole);
      window.removeEventListener(profileUpdatedEvent, syncRole);
      window.removeEventListener("storage", syncRole);
    };
  }, []);

  useEffect(() => {
    const handleNavigationClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor || anchor.getAttribute("target") === "_blank") return;
      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin || `${destination.pathname}${destination.search}` === `${window.location.pathname}${window.location.search}`) return;
      if (routeLoadingTimer.current) clearTimeout(routeLoadingTimer.current);
      routeLoadingTimer.current = setTimeout(() => setRouteLoading(true), 140);
    };
    document.addEventListener("click", handleNavigationClick);
    return () => {
      document.removeEventListener("click", handleNavigationClick);
      if (routeLoadingTimer.current) clearTimeout(routeLoadingTimer.current);
    };
  }, []);

  useEffect(() => {
    if (routeLoadingTimer.current) clearTimeout(routeLoadingTimer.current);
    routeLoadingTimer.current = null;
    setRouteLoading(false);
  }, [pathname]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setDockMode((pathname.startsWith("/expert") && Boolean(params.get("request"))) || (pathname === "/questions" && (params.get("mode") === "expert" || Boolean(params.get("q")))) ? "expert" : "ai");
  }, [pathname]);

  useEffect(() => {
    const handleSupportMode = (event: Event) => setDockMode((event as CustomEvent<"ai" | "expert">).detail);
    window.addEventListener("morgan-support-mode-change", handleSupportMode);
    return () => window.removeEventListener("morgan-support-mode-change", handleSupportMode);
  }, []);

  useEffect(() => {
    const event = { type: pathname.startsWith("/tools") ? "tool_view" : "page_view", path: pathname, role, region, language, at: new Date().toISOString() };
    try {
      const previous = JSON.parse(window.localStorage.getItem("morgan-analytics-events") || "[]") as Array<typeof event>;
      window.localStorage.setItem("morgan-analytics-events", JSON.stringify([event, ...previous].slice(0, 1000)));
      window.dispatchEvent(new Event("morgan-analytics-updated"));
    } catch { /* Analytics should not block navigation when browser storage is unavailable. */ }
  }, [language, pathname, region, role]);

  useEffect(() => {
    const trackLink = (click: MouseEvent) => {
      if (!(click.target instanceof Element)) return;
      const anchor = click.target.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      const destination = new URL(anchor.href, window.location.href);
      const isDownload = anchor.hasAttribute("download");
      if (!isDownload && destination.hostname !== "www.morganthermalceramics.com" && destination.hostname !== "morganthermalceramics.com") return;
      const event = { type: isDownload ? "download" : destination.pathname.includes("products-systems") ? "product_view" : "official_link", path: pathname, target: destination.href, role, region, language, at: new Date().toISOString() };
      try {
        const previous = JSON.parse(window.localStorage.getItem("morgan-analytics-events") || "[]") as Array<typeof event>;
        window.localStorage.setItem("morgan-analytics-events", JSON.stringify([event, ...previous].slice(0, 1000)));
        window.dispatchEvent(new Event("morgan-analytics-updated"));
      } catch { /* Browser storage is optional for usage analytics. */ }
    };
    document.addEventListener("click", trackLink);
    return () => document.removeEventListener("click", trackLink);
  }, [language, pathname, region, role]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const navigateRole = (nextRole: string) => {
    setRole(nextRole);
    window.localStorage.setItem("prototype-role", nextRole);
    window.dispatchEvent(new Event("prototype-role-change"));
    setMenuOpen(false);
    if (nextRole === "Morgan User") router.push("/expert");
    else if (nextRole === "Super Admin") router.push("/admin");
    else router.push("/");
  };

  const logout = () => {
    setRole("Visitor");
    window.localStorage.removeItem("prototype-role");
    window.dispatchEvent(new Event("prototype-role-change"));
    setMenuOpen(false);
    router.push("/");
  };

  const submitDockSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanedQuery = dockQuery.trim();
    if (!cleanedQuery || !searchIndustryId || !searchProductId) return;
    const context = getSearchContext(searchIndustryId, searchProductId);
    if (dockMode === "expert") {
      const params = new URLSearchParams(window.location.search);
      const activeRequestId = pathname.startsWith("/expert") ? (window.localStorage.getItem("morgan-active-expert-thread") || params.get("request") || "") : "";
      if (activeRequestId) {
        const currentRole = window.localStorage.getItem("prototype-role") || "Visitor";
        const sender = currentRole === "Morgan User" || currentRole === "Super Admin" ? "expert" : "customer";
        if (appendConversationMessage(activeRequestId, cleanedQuery, sender)) {
          setDockQuery("");
          return;
        }
      }
      const requestId = submitExpertFollowUp(cleanedQuery, searchIndustryId, searchProductId, "Started from the shared support composer.");
      setDockQuery("");
      router.push(`/expert?request=${encodeURIComponent(requestId)}`);
    } else {
      saveSearchRoutingRequest(cleanedQuery, searchIndustryId, searchProductId);
      const params = new URLSearchParams({ q: cleanedQuery, industry: searchIndustryId, product: searchProductId, team: context.expertTeam });
      setDockQuery("");
      router.push(`/search?${params.toString()}`);
    }
  };

  return (
    <>
      <div className={`route-loading ${routeLoading ? "is-visible" : ""}`} role="status" aria-live="polite" aria-hidden={!routeLoading}>
        <span className="route-loading-bar" />
        <span className="route-loading-spinner" />
        <span className="visually-hidden">Loading page</span>
      </div>
      {menuOpen && <button className="reference-nav-backdrop" type="button" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
      <aside id="reference-navigation" className={`reference-nav ${menuOpen ? "is-open" : "is-closed"}`} aria-label="Main navigation" aria-hidden={!menuOpen}>
        <nav className="reference-nav-links">
          <Link onClick={() => setMenuOpen(false)} className={(pathname === "/" || pathname === roleHomeHref) ? "active" : ""} aria-current={(pathname === "/" || pathname === roleHomeHref) ? "page" : undefined} href={roleHomeHref}><Grid2X2 size={18} strokeWidth={1.8}/><span className="reference-nav-item-copy"><strong>{roleHomeLabel}</strong><small>{roleHomeLabel === "Dashboard" ? "Your workspace and assigned activity" : "Browse resources and get technical support"}</small></span></Link>
          <Link onClick={() => setMenuOpen(false)} className={isProductRoute ? "active" : ""} aria-current={isProductRoute ? "page" : undefined} href="/categories"><Boxes size={18} strokeWidth={1.8}/><span className="reference-nav-item-copy"><strong>Products</strong><small>Browse product lines and applications</small></span></Link>
          <Link onClick={() => setMenuOpen(false)} className={pathname.startsWith("/documents") ? "active" : ""} aria-current={pathname.startsWith("/documents") ? "page" : undefined} href="/documents"><FileText size={18} strokeWidth={1.8}/><span className="reference-nav-item-copy"><strong>Documents</strong><small>Datasheets, manuals and certificates</small></span></Link>
          <Link onClick={() => setMenuOpen(false)} className={isLegalRoute ? "active" : ""} aria-current={isLegalRoute ? "page" : undefined} href="/legal"><Info size={18} strokeWidth={1.8}/><span className="reference-nav-item-copy"><strong>Legal</strong><small>Privacy policy and terms of use</small></span></Link>
          <Link onClick={() => setMenuOpen(false)} className={pathname.startsWith("/tools") ? "active" : ""} aria-current={pathname.startsWith("/tools") ? "page" : undefined} href="/tools"><Calculator size={18} strokeWidth={1.8}/><span className="reference-nav-item-copy"><strong>Tools</strong><small>Calculators and technical resources</small></span></Link>
        </nav>
      </aside>

      <header className={`reference-topbar ${menuOpen ? "nav-open" : ""}`}>
        <div className="reference-header-brand">
          <BrandMark />
        </div>
        <div className="header-preview-control">
          <div className="prototype-preview">
            <Eye className="prototype-preview-icon" size={15} aria-hidden="true" />
            <BrandedSelect className="prototype-select" ariaLabel="Preview perspective" value={role} onValueChange={navigateRole} options={[{ value: "Visitor", label: "Visitor" }, { value: "Customer", label: "Customer" }, { value: "Morgan User", label: "Morgan" }, { value: "Super Admin", label: "Admin" }]} />
            <span className="preview-temporary-label">Preview</span>
          </div>
        </div>
        <div className="header-utility-controls">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild><button className="sticky-quick-contact header-quick-contact" type="button" aria-label="Quick contact Morgan support" title="Quick contact"><Phone size={18} aria-hidden="true" /></button></DropdownMenu.Trigger>
            <DropdownMenu.Portal><DropdownMenu.Content className="profile-menu-content sticky-contact-menu" align="end" side="bottom" sideOffset={utilityMenuOffset} collisionPadding={10}>
              <DropdownMenu.Label className="profile-menu-label profile-panel-heading"><span className="profile-panel-heading-icon"><Phone size={16} aria-hidden="true" /></span><span className="profile-panel-heading-copy"><strong>Quick contact</strong><small>Reach the Morgan support team</small></span></DropdownMenu.Label>
              <DropdownMenu.Separator className="profile-menu-separator" />
              <DropdownMenu.Item className="profile-menu-item" asChild><a href="mailto:AsktheExpert@morganplc.com"><Mail size={15} aria-hidden="true" /><span>Email the expert team</span><ChevronRight size={14} aria-hidden="true" /></a></DropdownMenu.Item>
              <DropdownMenu.Item className="profile-menu-item" asChild><a href="https://www.morganthermalceramics.com/en-gb/contact-us/" target="_blank" rel="noreferrer"><ExternalLink size={15} aria-hidden="true" /><span>Contact Morgan online</span><ChevronRight size={14} aria-hidden="true" /></a></DropdownMenu.Item>
            </DropdownMenu.Content></DropdownMenu.Portal>
          </DropdownMenu.Root>
          <DropdownMenu.Root onOpenChange={(open) => { if (open && welcomeNotificationUnread) markWelcomeNotificationRead(); }}>
            <DropdownMenu.Trigger asChild><button className={`notification-trigger ${welcomeNotificationUnread || (role !== "Visitor" && profileCompletion < 100) ? "has-unread" : ""}`} type="button" aria-label={welcomeNotificationUnread || (role !== "Visitor" && profileCompletion < 100) ? "Notifications, updates available" : "Notifications"} title="Notifications"><Bell size={18} aria-hidden="true" />{(welcomeNotificationUnread || (role !== "Visitor" && profileCompletion < 100)) && <span className="notification-count" aria-hidden="true">{Number(welcomeNotificationUnread) + Number(role !== "Visitor" && profileCompletion < 100)}</span>}</button></DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="notification-menu-content" align="end" side="bottom" sideOffset={utilityMenuOffset} collisionPadding={10}>
                <DropdownMenu.Label className="profile-menu-label profile-panel-heading notification-panel-heading"><span className="profile-panel-heading-icon"><Bell size={16} aria-hidden="true" /></span><span className="profile-panel-heading-copy"><strong>Notifications</strong><small>Updates for your account</small></span></DropdownMenu.Label>
                <DropdownMenu.Separator className="profile-menu-separator" />
                {role !== "Visitor" && profileCompletion < 100 && <DropdownMenu.Item asChild><Link className="notification-profile-link" href="/profile#personal-details"><span className="notification-welcome-icon"><CircleUserRound size={19} aria-hidden="true" /></span><span className="notification-welcome-copy"><strong>Complete your profile Â· {profileCompletion}%</strong><span>Add your personal, organization and contact details to get the most from Morgan support.</span><span className="notification-profile-action">Continue profile <ChevronRight size={13} aria-hidden="true" /></span></span><span className="notification-unread-indicator" aria-label="Action needed" /></Link></DropdownMenu.Item>}
                <article className={`notification-welcome ${welcomeNotificationUnread ? "is-unread" : "is-read"}`} role="status" aria-label={`${welcomeNotificationUnread ? "Unread" : "Read"} welcome notification`}>
                  <span className="notification-welcome-icon"><Sparkles size={19} aria-hidden="true" /></span>
                  <span className="notification-welcome-copy"><strong>Welcome to Morgan Ask the Expert</strong><span>Find documents, use tools, and connect with Morgan experts.</span><time>Just now</time></span>
                  {welcomeNotificationUnread && <span className="notification-unread-indicator" aria-label="Unread" />}
                </article>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild><button className={`profile-menu-trigger ${role !== "Visitor" && profileCompletion < 100 ? "has-profile-progress" : ""}`} type="button" aria-label={role !== "Visitor" && profileCompletion < 100 ? `Open profile and preferences, profile ${profileCompletion}% complete` : "Open profile and preferences"} title={role !== "Visitor" && profileCompletion < 100 ? `Profile ${profileCompletion}% complete` : "Profile and preferences"}><span className={`profile-avatar-progress ${role === "Visitor" ? "is-default" : profileCompletion === 100 ? "is-complete" : ""}`} style={{ "--profile-progress": `${role === "Visitor" ? 0 : profileCompletion}%` } as React.CSSProperties}><UserRound size={17} aria-hidden="true" /></span>{role !== "Visitor" && profileCompletion < 100 && <span className="profile-progress-badge" aria-hidden="true">{profileCompletion}%</span>}</button></DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="profile-menu-content" align="end" side="bottom" sideOffset={utilityMenuOffset} collisionPadding={10}>
                <DropdownMenu.Label className="profile-menu-label profile-panel-heading"><span className="profile-panel-heading-icon"><Settings size={16} aria-hidden="true" /></span><span className="profile-panel-heading-copy"><strong>Preferences</strong><small>Region and language</small></span></DropdownMenu.Label>
                {role !== "Visitor" && profileCompletion < 100 && <>
                  <DropdownMenu.Item asChild><Link className="profile-completion-menu-action" href="/profile#personal-details"><span className="profile-completion-menu-icon"><CircleUserRound size={17} aria-hidden="true" /></span><span className="profile-completion-menu-copy"><strong>Complete your profile</strong><small>{profileCompletion}% complete Â· Add your details</small></span><span className="profile-completion-menu-progress">{profileCompletion}%</span><ChevronRight size={14} aria-hidden="true" /></Link></DropdownMenu.Item>
                  <DropdownMenu.Separator className="profile-menu-separator" />
                </>}
                <DropdownMenu.Sub>
                  <DropdownMenu.SubTrigger className="profile-menu-item preference-trigger"><Globe size={16} aria-hidden="true" /><span>Region</span><span className="profile-menu-current">{region}</span><ChevronRight size={14} aria-hidden="true" /></DropdownMenu.SubTrigger>
                  <DropdownMenu.Portal><DropdownMenu.SubContent className="profile-menu-content profile-preference-submenu" sideOffset={6} collisionPadding={10}>
                    <DropdownMenu.Label className="profile-preference-heading">Choose a region</DropdownMenu.Label>
                    <DropdownMenu.RadioGroup value={region} onValueChange={changeRegion}>
                      {[
                        { value: "EMEA", description: "Europe, Middle East & Africa" },
                        { value: "Americas", description: "North, Central & South America" },
                        { value: "Asia Pacific", description: "Asia and Pacific markets" },
                        { value: "Australia", description: "Australia and New Zealand" },
                      ].map((item) => <DropdownMenu.RadioItem className="profile-menu-item profile-preference-option" key={item.value} value={item.value}><span className="profile-preference-copy"><span>{item.value}</span><span>{item.description}</span></span><DropdownMenu.ItemIndicator className="profile-menu-check"><Check size={15} aria-hidden="true" /></DropdownMenu.ItemIndicator></DropdownMenu.RadioItem>)}
                    </DropdownMenu.RadioGroup>
                  </DropdownMenu.SubContent></DropdownMenu.Portal>
                </DropdownMenu.Sub>
                <DropdownMenu.Sub>
                  <DropdownMenu.SubTrigger className="profile-menu-item preference-trigger"><Languages size={16} aria-hidden="true" /><span>Language</span><span className="profile-menu-current">{language}</span><ChevronRight size={14} aria-hidden="true" /></DropdownMenu.SubTrigger>
                  <DropdownMenu.Portal><DropdownMenu.SubContent className="profile-menu-content profile-preference-submenu" sideOffset={6} collisionPadding={10}>
                    <DropdownMenu.Label className="profile-preference-heading">Choose a language</DropdownMenu.Label>
                    <DropdownMenu.RadioGroup value={language} onValueChange={changeLanguage}>
                      {[{ value: "English", description: "English" }, { value: "Deutsch", description: "German" }, { value: "FranÃ§ais", description: "French" }, { value: "EspaÃ±ol", description: "Spanish" }].map((item) => <DropdownMenu.RadioItem className="profile-menu-item profile-preference-option" key={item.value} value={item.value}><span className="profile-preference-copy"><span>{item.value}</span><span>{item.description}</span></span><DropdownMenu.ItemIndicator className="profile-menu-check"><Check size={15} aria-hidden="true" /></DropdownMenu.ItemIndicator></DropdownMenu.RadioItem>)}
                    </DropdownMenu.RadioGroup>
                  </DropdownMenu.SubContent></DropdownMenu.Portal>
                </DropdownMenu.Sub>
                <DropdownMenu.Separator className="profile-menu-separator" />
                <DropdownMenu.Item className="profile-menu-item" asChild><Link href="/profile#password-reset"><KeyRound size={16} aria-hidden="true" /><span>Password &amp; security</span><ChevronRight size={14} aria-hidden="true" /></Link></DropdownMenu.Item>
                <DropdownMenu.Item className="profile-menu-item" asChild><Link href="/technical-documents"><FileText size={16} aria-hidden="true" /><span>Technical Documents</span><ChevronRight size={14} aria-hidden="true" /></Link></DropdownMenu.Item>
                <DropdownMenu.Separator className="profile-menu-separator" />
                <div className="profile-account-actions" role="group" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
                  {role === "Visitor" ? <>
                    <DropdownMenu.Item className="profile-menu-item" asChild><Link href="/sign-in"><LogIn size={15} aria-hidden="true" /><span>Log in</span></Link></DropdownMenu.Item>
                    <DropdownMenu.Item className="profile-menu-item" asChild><Link href="/sign-in"><UserRound size={15} aria-hidden="true" /><span>Sign up</span></Link></DropdownMenu.Item>
                  </> : <>
                    <DropdownMenu.Item className="profile-menu-item" asChild><Link href="/profile"><UserRound size={15} aria-hidden="true" /><span>My Profile</span></Link></DropdownMenu.Item>
                    <DropdownMenu.Item className="profile-menu-item logout-action" onSelect={logout}><LogOut size={15} aria-hidden="true" /><span>Logout</span></DropdownMenu.Item>
                  </>}
                </div>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </header>

      <section className={`reference-subheader ${menuOpen ? "nav-open" : ""}`} aria-label="Page navigation and search">
        <button className={`reference-menu-button reference-subheader-menu ${menuOpen ? "is-active" : ""}`} type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} title={menuOpen ? "Close main navigation" : "Open main navigation"} aria-controls="reference-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <X size={20} strokeWidth={2.5} aria-hidden="true" /> : <Menu size={21} strokeWidth={2.5} aria-hidden="true" />}
        </button>
        <div className="reference-subheader-context">
          <h1>{pageTitle}</h1>
          <nav className="reference-breadcrumbs" aria-label="Breadcrumbs">
            {breadcrumbs.map((crumb, index) => (
              <span className="breadcrumb-part" key={`${crumb.label}-${index}`}>
                {index > 0 && <ChevronRight className="breadcrumb-chevron" size={12} strokeWidth={1.8} aria-hidden="true" />}
                {crumb.href ? <Link href={crumb.href}>{crumb.label}</Link> : <span aria-current="page">{crumb.label}</span>}
              </span>
            ))}
          </nav>
        </div>
        <form className={`sticky-search-dock ${pathname === "/" ? "is-home-highlighted" : ""}`} onSubmit={submitDockSearch} role="search">
          <span className="sticky-search-icon"><Search size={17} aria-hidden="true" /></span>
          <select className="sticky-search-mode" aria-label="Choose support type" value={dockMode} onChange={(event) => setDockMode(event.target.value as "ai" | "expert")}><option value="ai">Morgan AI</option><option value="expert">Expert chat</option></select>
          <input id="morgan-ai-prompt" aria-label={dockMode === "ai" ? "Ask Morgan AI about a product or technical question" : "Ask a Morgan expert a product or technical question"} value={dockQuery} onChange={(event) => setDockQuery(event.target.value)} placeholder={dockMode === "ai" ? "Ask Morgan AI about products or documentsâ€¦" : "Describe your question for a Morgan expertâ€¦"} />
          <select aria-label="Search industry" value={searchIndustryId} onChange={(event) => { setSearchIndustryId(event.target.value); setSearchProductId(""); window.localStorage.setItem("morgan-search-industry", event.target.value); window.localStorage.removeItem("morgan-search-product"); }}><option value="">Industry</option>{industries.map((industry) => <option key={industry.id} value={industry.id}>{industry.name}</option>)}</select>
          <select aria-label="Search product" value={searchProductId} onChange={(event) => { setSearchProductId(event.target.value); window.localStorage.setItem("morgan-search-product", event.target.value); }} disabled={!searchIndustryId}><option value="">Product</option>{dockProducts.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</select>
          <button type="submit" aria-label="Send search" disabled={!dockQuery.trim() || !searchIndustryId || !searchProductId}><ArrowUp size={17} aria-hidden="true" /></button>
        </form>
        <div className="subheader-actions">
          {pathname !== "/questions" && <AskExpertBadge />}
        </div>
      </section>

      <div className={`chrome-page-content reference-content ${menuOpen ? "nav-open" : ""}`}>{children}</div>

    </>
  );
}
