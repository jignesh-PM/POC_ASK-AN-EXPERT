import Link from "next/link";

export default function AdminDashboard() {
  return (
    <main className="workspace-shell">
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <Link className="active" href="/admin">
            Overview
          </Link>
          <Link href="/admin?view=users">Users & alpha IDs</Link>
          <Link href="/admin?view=content">Content</Link>
          <Link href="/admin?view=experts">Expert teams</Link>
          <Link href="/documents">Knowledge base</Link>
          <Link href="/tools">Restricted tools</Link>
          <Link href="/admin?view=analytics">Analytics</Link>
          <Link href="/admin?view=settings">Settings</Link>
        </aside>
        <section className="admin-main">
          <h1>Portal overview</h1>
          <div className="metric-grid">
            <article className="metric-card">
              <span>Active users</span>
              <h2>1,284</h2>
              <p>↑ 12.4% this month</p>
            </article>
            <article className="metric-card">
              <span>Expert chats</span>
              <h2>348</h2>
              <p>↑ 8.1% this month</p>
            </article>
            <article className="metric-card">
              <span>AI resolution</span>
              <h2>64%</h2>
              <p>↑ 4.6% this month</p>
            </article>
            <article className="metric-card">
              <span>Avg. response</span>
              <h2>18m</h2>
              <p>↓ 6m faster</p>
            </article>
          </div>
          <div className="admin-grid">
            <article className="chart-card">
              <h3>Customer activity</h3>
              <div className="bars">
                <i style={{ height: "35%" }} />
                <i style={{ height: "48%" }} />
                <i style={{ height: "42%" }} />
                <i style={{ height: "66%" }} />
                <i style={{ height: "58%" }} />
                <i style={{ height: "78%" }} />
                <i style={{ height: "92%" }} />
                <i style={{ height: "83%" }} />
              </div>
            </article>
            <article className="table-card">
              <h3>Top product interests</h3>
              <table>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Users</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Fibres</td>
                    <td>342</td>
                  </tr>
                  <tr>
                    <td>Refractories</td>
                    <td>286</td>
                  </tr>
                  <tr>
                    <td>Microporous</td>
                    <td>214</td>
                  </tr>
                  <tr>
                    <td>PFP</td>
                    <td>191</td>
                  </tr>
                  <tr>
                    <td>Fire Assay</td>
                    <td>126</td>
                  </tr>
                </tbody>
              </table>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
