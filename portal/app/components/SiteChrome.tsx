"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Boxes, Info, Newspaper, Settings, Phone, MessageCircle, UserRound, LogIn, Menu, Grid2X2 } from "lucide-react";

function BrandMark() {
  return (
    <Link className="brand-mark reference-brand" href="/" aria-label="Morgan Ask the Expert home">
      <img className="morgan-logo" src="/morgan-logo.png" alt="Morgan Advanced Materials" />
    </Link>
  );
}

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(true);
  const [role, setRole] = useState("Visitor");
  const [region, setRegion] = useState("EMEA");
  const [language, setLanguage] = useState("English");
  const pathname = usePathname();
  const router = useRouter();

  const navigateRole = (nextRole: string) => {
    setRole(nextRole);
    if (nextRole === "Morgan User") router.push("/expert");
    else if (nextRole === "Super Admin") router.push("/admin");
    else if (nextRole === "Customer") router.push("/categories");
    else router.push("/");
  };

  return (
    <>
      <aside className={`reference-nav ${menuOpen ? "is-open" : "is-closed"}`} aria-label="Main navigation" aria-hidden={!menuOpen}>
        <div className="reference-nav-logo"><BrandMark /></div>
        <div className="reference-region-language">
          <label><span>Region</span><select value={region} onChange={(event) => setRegion(event.target.value)} aria-label="Select region"><option>EMEA</option><option>Americas</option><option>Asia Pacific</option><option>Australia</option></select></label>
          <label><span>Language</span><select value={language} onChange={(event) => setLanguage(event.target.value)} aria-label="Select language"><option>English</option><option>Deutsch</option><option>Français</option><option>Español</option></select></label>
        </div>
        <nav className="reference-nav-links">
          <Link className={pathname === "/" ? "active" : ""} href="/"><Grid2X2 size={18} strokeWidth={1.8}/><span>Home</span></Link>
          <Link className={pathname.includes("category") || pathname.includes("product") ? "active" : ""} href="/categories"><Boxes size={18} strokeWidth={1.8}/><span>Products</span></Link>
          <Link href="/privacy"><Info size={18} strokeWidth={1.8}/><span>About</span></Link>
          <Link className="ask-nav-link" href="/questions"><MessageCircle size={18} strokeWidth={1.8}/><span>Ask the Expert</span></Link>
          <Link href="/documents"><Newspaper size={18} strokeWidth={1.8}/><span>News</span></Link>
        </nav>
        <div className="reference-nav-account">
          {role === "Visitor" ? (
            <div className="auth-nav-row"><Link href="/sign-in"><LogIn size={15} strokeWidth={1.8}/><span>Login</span></Link><i /><Link href="/sign-in"><UserRound size={15} strokeWidth={1.8}/><span>Sign up</span></Link></div>
          ) : (
            <Link href="/profile" className="nav-profile-row"><UserRound size={16} strokeWidth={1.8}/><span>My profile</span></Link>
          )}
        </div>
        <div className="reference-nav-bottom">
          <Link href="/privacy"><Settings size={18} strokeWidth={1.8}/><span>Feedback</span></Link>
          <a href="mailto:AsktheExpert@morganplc.com"><Phone size={18} strokeWidth={1.8}/><span>Contact Us</span></a>
        </div>
      </aside>

      <header className={`reference-topbar ${menuOpen ? "nav-open" : ""}`}>
        <button className={`reference-menu-button ${menuOpen ? "is-active" : ""}`} type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><Menu size={20} strokeWidth={1.8}/></button>
        <div className="reference-banner-title"><span>{pathname === "/expert" ? "Ask the Expert" : pathname === "/admin" ? "Admin Portal" : pathname === "/products" || pathname === "/categories" ? "Products" : pathname === "/about" ? "About Morgan" : "Ask the Expert"}</span></div>
        <div className="reference-role-switcher">
          {["Visitor", "Customer", "Morgan User", "Super Admin"].map((item) => (
            <button key={item} type="button" className={role === item ? "active" : ""} onClick={() => navigateRole(item)}>{item}</button>
          ))}
        </div>
      </header>

      <div className={`chrome-page-content reference-content ${menuOpen ? "nav-open" : ""}`}>{children}</div>

      <footer className={`global-footer reference-footer ${menuOpen ? "nav-open" : ""}`}>
        <div className="footer-single-line"><span>© 2026 Morgan Advanced Materials</span><nav><Link href="/privacy">Privacy notice</Link><i /><Link href="/terms">Terms of use</Link></nav></div>
      </footer>
    </>
  );
}
