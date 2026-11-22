import Link from "next/link";
import { ArrowRight, FileText, ShieldCheck } from "@/app/components/Icon";

export default function LegalPage() {
  return <main className="simple-page about-page">
    <div className="simple-head"><p className="eyebrow">MORGAN ASK THE EXPERT</p><h1>Legal</h1><p>Privacy and terms for using Morgan Ask the Expert.</p></div>
    <section className="about-policy-grid" aria-label="Legal information">
      <Link className="about-policy-card" href="/privacy"><span className="about-policy-icon"><ShieldCheck size={21} aria-hidden="true" /></span><span className="about-policy-kicker">YOUR INFORMATION</span><h2>Privacy Policy</h2><p>Learn how personal and profile information is handled when you use this portal.</p><b>Read privacy policy <ArrowRight size={14} aria-hidden="true" /></b></Link>
      <Link className="about-policy-card" href="/terms"><span className="about-policy-icon"><FileText size={21} aria-hidden="true" /></span><span className="about-policy-kicker">PORTAL GUIDANCE</span><h2>Terms of Use</h2><p>Review the terms that apply to product information, technical content and expert support.</p><b>Read terms of use <ArrowRight size={14} aria-hidden="true" /></b></Link>
    </section>
  </main>;
}