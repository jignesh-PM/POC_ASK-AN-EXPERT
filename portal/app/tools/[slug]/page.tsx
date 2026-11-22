import ToolRunner from "../../components/ToolRunner";
import { tools } from "../../lib/mock-data";

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = tools.find((item) => item.slug === slug) || tools[0];
  return <main className="simple-page"><div className="simple-head"><p className="eyebrow">{tool.type.toUpperCase()}</p><h1>{tool.title}</h1><p>{tool.description}</p></div><ToolRunner slug={tool.slug} title={tool.title} description={tool.description} restricted={Boolean(tool.restricted)} /></main>;
}
