import Link from "next/link";

export default function ProfilePage() {
  return (
    <main className="simple-page">
      <div className="simple-head">
        <Link href="/">← Back to portal</Link>
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
            <select defaultValue="EMEA">
              <option>EMEA</option>
              <option>Americas</option>
              <option>Asia Pacific</option>
            </select>
          </label>
          <label>
            Product interest
            <select defaultValue="Microporous">
              <option>Microporous</option>
              <option>Fibres</option>
              <option>Refractories</option>
              <option>PFP</option>
            </select>
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
      </section>
    </main>
  );
}
