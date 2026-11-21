import Link from "next/link";
import BrandedSelect from "../components/BrandedSelect";
import PasswordSettings from "../components/PasswordSettings";

export default function ProfilePage() {
  return (
    <main className="simple-page">
      <div className="simple-head">

        <p className="eyebrow">CUSTOMER PROFILE</p>
        <h1>Your profile</h1>
      </div>
      <section className="profile-page">
        <div>
          <label>
            Full name
            <input defaultValue="Alex Morgan" />
          </label>
          <label>
            Company
            <input defaultValue="Morgan Industries" />
          </label>
          <label>
            Region
            <BrandedSelect ariaLabel="Region" defaultValue="EMEA" options={[{ value: "EMEA", label: "EMEA" }, { value: "Americas", label: "Americas" }, { value: "Asia Pacific", label: "Asia Pacific" }]} />
          </label>
          <label>
            Product interest
            <BrandedSelect ariaLabel="Product interest" defaultValue="Microporous" options={[{ value: "Microporous", label: "Microporous" }, { value: "Fibres", label: "Fibres" }, { value: "Refractories", label: "Refractories" }, { value: "PFP", label: "PFP" }]} />
          </label>
        </div>
        <aside>
          <h2>Data & consent</h2>
          <p>Privacy notice accepted on 21 November 2026.</p>
          <Link href="/privacy">Review privacy notice →</Link>
          <button type="button">Request data export</button>
          <button className="danger" type="button">
            Request account deletion
          </button>
        </aside>
        <PasswordSettings />
      </section>
    </main>
  );
}
