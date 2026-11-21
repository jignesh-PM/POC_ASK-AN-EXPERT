import Link from "next/link";
import { tools } from "../../lib/mock-data";
import BrandedSelect from "../../components/BrandedSelect";

export function generateStaticParams(){return tools.map((tool)=>({slug:tool.slug}));}

export default async function ToolPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params; const tool=tools.find((item)=>item.slug===slug)||tools[0];
 return <main className="simple-page"><div className="simple-head"><p className="eyebrow">{tool.type.toUpperCase()}</p><h1>{tool.title}</h1><p>{tool.description}</p></div><section className="tool-page"><h2>Enter your details</h2>{tool.slug=== "pfp-certificates" ? <div className="tool-form"><label>Product<input placeholder="FireMaster duct wrap" /></label><label>Standard<BrandedSelect ariaLabel="Standard" defaultValue="EN 13501" options={[{value:"EN 13501",label:"EN 13501"},{value:"BS 476",label:"BS 476"}]}/></label><button type="button">Search certificates</button></div>:<div className="tool-form"><label>Operating temperature (°C)<input type="number" defaultValue="1260" /></label><label>Insulation thickness (mm)<input type="number" defaultValue="50" /></label><button type="button">Calculate</button></div>}</section></main>;
}
