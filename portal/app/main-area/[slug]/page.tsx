import Link from "next/link";
import { mainAreas } from "../../lib/mock-data";

export function generateStaticParams(){return mainAreas.map((area)=>({slug:area.slug}));}

export default async function MainAreaPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params; const area=mainAreas.find((item)=>item.slug===slug)||mainAreas[0];
 return <main className="simple-page"><div className="simple-head"><Link href="/">← Back to portal</Link><p className="eyebrow">MAIN AREA</p><h1>{area.title}</h1><p>{area.description}</p></div><section className="main-area-list"><Link href="/documents"><span>01</span><div><h2>Technical resources</h2><p>Browse documents and downloads for this area.</p></div><b>View resources →</b></Link><Link href="/questions"><span>02</span><div><h2>Ask an expert</h2><p>Start an AI-assisted question or talk to the responding team.</p></div><b>Ask now →</b></Link></section></main>;
}
