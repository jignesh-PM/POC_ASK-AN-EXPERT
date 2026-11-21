"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Boxes, Info, Settings, Phone, MessageCircle, UserRound, LogIn, LogOut, Grid2X2, Calculator, FileText, Eye, Sun, Moon, Globe, Languages, ChevronLeft, ChevronRight, Bell, Check, Palette, Sparkles, KeyRound } from "lucide-react";
import BrandedSelect from "./BrandedSelect";
import AskExpertBadge from "./AskExpertBadge";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

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
    "/categories": "Products",
    "/documents": "Documents",
    "/tools": "Tools",
    "/expert": "Expert Desk",
    "/admin": "Admin Portal",
    "/questions": "Ask a Question",
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
  }

  if (crumbs[crumbs.length - 1]?.label !== pageTitle) crumbs.push({ label: pageTitle });
  return crumbs;
}

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(true);
  const [role, setRole] = useState("Visitor");
  const [region, setRegion] = useState("EMEA");
  const [language, setLanguage] = useState("English");
  const [welcomeNotificationUnread, setWelcomeNotificationUnread] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [utilityMenuOffset, setUtilityMenuOffset] = useState(15);
  const [routeLoading, setRouteLoading] = useState(false);
  const routeLoadingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const pageTitle = getPageTitle(pathname);
  const breadcrumbs = getBreadcrumbs(pathname, pageTitle);
  const isProductRoute = pathname.startsWith("/categories") || pathname.startsWith("/category/") || pathname.startsWith("/main-area/");
  const isAboutRoute = pathname === "/privacy" || pathname === "/terms";
  const isExpertRoute = pathname === "/questions" || pathname.startsWith("/expert");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("morgan-theme");
    const initialTheme = savedTheme === "dark" ? "dark" : "light";
    setTheme(initialTheme);
    document.documentElement.dataset.theme = initialTheme;
  }, []);

  useEffect(() => {
    setWelcomeNotificationUnread(window.localStorage.getItem("morgan-welcome-notification-read") !== "true");
  }, []);

  const markWelcomeNotificationRead = () => {
    setWelcomeNotificationUnread(false);
    window.localStorage.setItem("morgan-welcome-notification-read", "true");
  };

  useEffect(() => {
    const updateMenuOffset = () => setUtilityMenuOffset(window.innerWidth <= 620 ? 7 : window.innerWidth <= 760 ? 8 : 15);
    updateMenuOffset();
    window.addEventListener("resize", updateMenuOffset);
    return () => window.removeEventListener("resize", updateMenuOffset);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("morgan-theme", nextTheme);
  };

  useEffect(() => {
    const savedRole = window.localStorage.getItem("prototype-role");
    if (savedRole) setRole(savedRole);
    const syncRole = () => setRole(window.localStorage.getItem("prototype-role") || "Visitor");
    window.addEventListener("prototype-role-change", syncRole);
    return () => window.removeEventListener("prototype-role-change", syncRole);
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
    const drawer = document.getElementById("reference-navigation");
    const footer = document.querySelector<HTMLElement>(".reference-footer");
    if (!drawer || !footer) return;

    const alignDrawerWithFooter = () => {
      const footerRect = footer.getBoundingClientRect();
      const footerReached = window.scrollY + window.innerHeight > footerRect.top + window.scrollY;
      const bottomInset = footerReached ? Math.max(0, window.innerHeight - footerRect.bottom) : 0;
      drawer.style.setProperty("--drawer-bottom-inset", `${Math.ceil(bottomInset)}px`);
    };

    alignDrawerWithFooter();
    window.addEventListener("scroll", alignDrawerWithFooter, { passive: true });
    window.addEventListener("resize", alignDrawerWithFooter);
    const footerObserver = new ResizeObserver(alignDrawerWithFooter);
    footerObserver.observe(footer);
    return () => {
      window.removeEventListener("scroll", alignDrawerWithFooter);
      window.removeEventListener("resize", alignDrawerWithFooter);
      footerObserver.disconnect();
    };
  }, [pathname, menuOpen]);

  const navigateRole = (nextRole: string) => {
    setRole(nextRole);
    window.localStorage.setItem("prototype-role", nextRole);
    window.dispatchEvent(new Event("prototype-role-change"));
    setMenuOpen(false);
    if (nextRole === "Morgan User") router.push("/expert");
    else if (nextRole === "Super Admin") router.push("/admin");
    else if (nextRole === "Customer") router.push("/categories");
    else router.push("/");
  };

  const logout = () => {
    setRole("Visitor");
    window.localStorage.removeItem("prototype-role");
    window.dispatchEvent(new Event("prototype-role-change"));
    setMenuOpen(false);
    router.push("/");
  };

  return (
    <>
      <div className={`route-loading ${routeLoading ? "is-visible" : ""}`} role="status" aria-live="polite" aria-hidden={!routeLoading}>
        <span className="route-loading-bar" />
        <span className="route-loading-spinner" />
        <span className="visually-hidden">Loading page</span>
      </div>
      <aside id="reference-navigation" className={`reference-nav ${menuOpen ? "is-open" : "is-closed"}`} aria-label="Main navigation" aria-hidden={!menuOpen}>
        <nav className="reference-nav-links">
          <Link className={pathname === "/" ? "active" : ""} aria-current={pathname === "/" ? "page" : undefined} href="/"><Grid2X2 size={18} strokeWidth={1.8}/><span>Home</span></Link>
          <Link className={isProductRoute ? "active" : ""} aria-current={isProductRoute ? "page" : undefined} href="/categories"><Boxes size={18} strokeWidth={1.8}/><span>Products</span></Link>
          <Link className={pathname.startsWith("/tools") ? "active" : ""} aria-current={pathname.startsWith("/tools") ? "page" : undefined} href="/tools"><Calculator size={18} strokeWidth={1.8}/><span>Tools</span></Link>
          <Link className={pathname.startsWith("/documents") ? "active" : ""} aria-current={pathname.startsWith("/documents") ? "page" : undefined} href="/documents"><FileText size={18} strokeWidth={1.8}/><span>Documents</span></Link>
          <Link className={isAboutRoute ? "active" : ""} aria-current={isAboutRoute ? "page" : undefined} href="/privacy"><Info size={18} strokeWidth={1.8}/><span>About</span></Link>
          <Link className={`ask-nav-link ${isExpertRoute ? "active" : ""}`} aria-current={isExpertRoute ? "page" : undefined} href="/questions"><MessageCircle size={18} strokeWidth={1.8}/><span>Ask the Expert</span></Link>
        </nav>
        <div className="reference-nav-bottom">
          <Link href="/privacy"><Settings size={18} strokeWidth={1.8}/><span>Feedback</span></Link>
          <a href="mailto:AsktheExpert@morganplc.com"><Phone size={18} strokeWidth={1.8}/><span>Contact Us</span></a>
        </div>
      </aside>

      <header className={`reference-topbar ${menuOpen ? "nav-open" : ""}`}>
        <div className="header-utility-controls">
          <div className="prototype-preview">
            <Eye className="prototype-preview-icon" size={15} aria-hidden="true" />
            <BrandedSelect className="prototype-select" ariaLabel="Preview perspective" value={role} onValueChange={navigateRole} options={[{ value: "Visitor", label: "Visitor" }, { value: "Customer", label: "Customer" }, { value: "Morgan User", label: "Morgan" }, { value: "Super Admin", label: "Admin" }]} />
            <span className="preview-temporary-label">Preview</span>
          </div>
          <AskExpertBadge />
          <DropdownMenu.Root onOpenChange={(open) => { if (open && welcomeNotificationUnread) markWelcomeNotificationRead(); }}>
            <DropdownMenu.Trigger asChild><button className={`notification-trigger ${welcomeNotificationUnread ? "has-unread" : ""}`} type="button" aria-label={welcomeNotificationUnread ? "Notifications, 1 unread" : "Notifications"} title="Notifications"><Bell size={18} aria-hidden="true" />{welcomeNotificationUnread && <span className="notification-count" aria-hidden="true">1</span>}</button></DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="notification-menu-content" align="end" side="bottom" sideOffset={utilityMenuOffset} collisionPadding={10}>
                <DropdownMenu.Label className="profile-menu-label profile-panel-heading notification-panel-heading"><span className="profile-panel-heading-icon"><Bell size={16} aria-hidden="true" /></span><span className="profile-panel-heading-copy"><strong>Notifications</strong><small>Updates for your account</small></span></DropdownMenu.Label>
                <DropdownMenu.Separator className="profile-menu-separator" />
                <article className={`notification-welcome ${welcomeNotificationUnread ? "is-unread" : "is-read"}`} role="status" aria-label={`${welcomeNotificationUnread ? "Unread" : "Read"} welcome notification`}>
                  <span className="notification-welcome-icon"><Sparkles size={19} aria-hidden="true" /></span>
                  <span className="notification-welcome-copy"><strong>Welcome to Morgan Ask the Expert</strong><span>Find documents, use tools, and connect with Morgan experts.</span><time>Just now</time></span>
                  {welcomeNotificationUnread && <span className="notification-unread-indicator" aria-label="Unread" />}
                </article>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild><button className="profile-menu-trigger" type="button" aria-label="Open profile and preferences" title="Profile and preferences"><UserRound size={18} aria-hidden="true" /></button></DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="profile-menu-content" align="end" side="bottom" sideOffset={utilityMenuOffset} collisionPadding={10}>
                <DropdownMenu.Label className="profile-menu-label profile-panel-heading"><span className="profile-panel-heading-icon"><Settings size={16} aria-hidden="true" /></span><span className="profile-panel-heading-copy"><strong>Preferences</strong><small>Region, language and appearance</small></span></DropdownMenu.Label>
                <DropdownMenu.Sub>
                  <DropdownMenu.SubTrigger className="profile-menu-item preference-trigger"><Globe size={16} aria-hidden="true" /><span>Region</span><span className="profile-menu-current">{region}</span><ChevronRight size={14} aria-hidden="true" /></DropdownMenu.SubTrigger>
                  <DropdownMenu.Portal><DropdownMenu.SubContent className="profile-menu-content profile-preference-submenu" sideOffset={6} collisionPadding={10}>
                    <DropdownMenu.Label className="profile-preference-heading">Choose a region</DropdownMenu.Label>
                    <DropdownMenu.RadioGroup value={region} onValueChange={setRegion}>
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
                    <DropdownMenu.RadioGroup value={language} onValueChange={setLanguage}>
                      {[{ value: "English", description: "English" }, { value: "Deutsch", description: "German" }, { value: "Français", description: "French" }, { value: "Español", description: "Spanish" }].map((item) => <DropdownMenu.RadioItem className="profile-menu-item profile-preference-option" key={item.value} value={item.value}><span className="profile-preference-copy"><span>{item.value}</span><span>{item.description}</span></span><DropdownMenu.ItemIndicator className="profile-menu-check"><Check size={15} aria-hidden="true" /></DropdownMenu.ItemIndicator></DropdownMenu.RadioItem>)}
                    </DropdownMenu.RadioGroup>
                  </DropdownMenu.SubContent></DropdownMenu.Portal>
                </DropdownMenu.Sub>
                <div className="profile-theme-row">
                  <span className="profile-theme-label"><Palette size={16} aria-hidden="true" /><span>Appearance</span></span>
                  <span className="profile-theme-current">{theme === "dark" ? "Dark" : "Light"}</span>
                  <button className={`profile-theme-switch ${theme === "dark" ? "is-dark" : ""}`} type="button" role="switch" aria-checked={theme === "dark"} aria-label="Toggle dark mode" onClick={toggleTheme}>
                    <span className="profile-theme-switch-thumb">{theme === "dark" ? <Moon size={12} aria-hidden="true" /> : <Sun size={12} aria-hidden="true" />}</span>
                  </button>
                </div>
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

      <div className="reference-header-brand">
        <BrandMark />
      </div>

      <section className={`reference-subheader ${menuOpen ? "nav-open" : ""}`} aria-label="Page navigation and actions">
        <button className={`reference-menu-button reference-subheader-menu ${menuOpen ? "is-active" : ""}`} type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} title={menuOpen ? "Close main navigation" : "Open main navigation"} aria-controls="reference-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <ChevronLeft size={20} strokeWidth={2.5} aria-hidden="true" /> : <ChevronRight size={20} strokeWidth={2.5} aria-hidden="true" />}
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
      </section>

      <div className={`chrome-page-content reference-content ${menuOpen ? "nav-open" : ""}`}>{children}</div>

      <footer className={`global-footer reference-footer ${menuOpen ? "nav-open" : ""}`}>
        <div className="footer-single-line"><span className="footer-copyright">&copy; 2026 Morgan Advanced Materials plc. All rights reserved.</span><nav aria-label="Footer links"><Link href="/sitemap">Site Map</Link><i aria-hidden="true" /><Link href="/privacy">Privacy Policy</Link><i aria-hidden="true" /><Link href="/terms">Terms of Use</Link></nav></div>
      </footer>
    </>
  );
}
