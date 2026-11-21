import Link from "next/link";
import { tools } from "../lib/mock-data";

export default function ToolsPage() {
  return (
    <main className="simple-page">
      <div className="simple-head">
        <Link href="/">← Back to portal</Link>
        <p className="eyebrow">TECHNICAL SUPPORT</p>
        <h1>Tools</h1>
      </div>
      <div className="simple-grid">
        {tools.map((tool) => (
          <Link
            className="simple-card"
            href={`/tools/${tool.slug}`}
            key={tool.slug}
          >
            <span>{tool.type}</span>
            <h2>{tool.title}</h2>
            <p>{tool.description}</p>
            {tool.restricted && <em>Profile required</em>}
            <b>Open tool →</b>
          </Link>
        ))}
      </div>
    </main>
  );
}
