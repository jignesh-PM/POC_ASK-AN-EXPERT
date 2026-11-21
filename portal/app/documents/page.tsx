import Link from "next/link";
import { documents } from "../lib/mock-data";

export default function DocumentsPage() {
  return (
    <main className="simple-page">
      <div className="simple-head">
        <Link href="/">← Back to portal</Link>
        <p className="eyebrow">DOCUMENTS</p>
        <h1>Technical documents</h1>
      </div>
      <div className="document-list simple-document-list">
        {documents.map((doc) => (
          <article key={doc.title}>
            <div className="doc-icon">PDF</div>
            <div>
              <h3>{doc.title}</h3>
              <p>
                {doc.type} · {doc.line}
              </p>
            </div>
            <span>{doc.updated}</span>
            <button type="button">View</button>
          </article>
        ))}
      </div>
    </main>
  );
}
