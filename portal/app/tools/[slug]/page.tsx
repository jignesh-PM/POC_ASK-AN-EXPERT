import Link from "next/link";
import { tools } from "../../lib/mock-data";

export function generateStaticParams(){return tools.map((tool)=>({slug:tool.slug}));}

export default async function ToolPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params; const tool=tools.find((item)=>item.slug===slug)||tools[0];
 return <main className="simple-page"><div className="simple-head"><Link href="/tools">← Back to tools</Link><p className="eyebrow">{tool.type.toUpperCase()}</p><h1>{tool.title}</h1><p>{tool.description}</p></div><section className="tool-page"><h2>Enter your details</h2>{tool.slug=== "pfp-certificates" ? <div className="tool-form"><label>Product<input placeholder="FireMaster duct wrap" /></label><label>Standard<select><option>EN 13501</option><option>BS 476</option></select></label><button type="button">Search certificates</button></div>:<div className="tool-form"><label>Operating temperature (°C)<input type="number" defaultValue="1260" /></label><label>Insulation thickness (mm)<input type="number" defaultValue="50" /></label><button type="button">Calculate</button></div>}</section></main>;
}
