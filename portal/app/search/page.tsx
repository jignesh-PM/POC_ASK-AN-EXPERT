import Link from "next/link";
import { searchIndexedResources } from "../lib/site-index";

export const instant = false;

export default async function SearchPage({searchParams}:{searchParams:Promise<{q?:string}>}){
 const {q=""}=await searchParams;
 const results=searchIndexedResources(q);
 return <main className="simple-page"><div className="simple-head"><p className="eyebrow">OFFICIAL-SITE INDEX</p><h1>{q ? `Search results for “${q}”` : "Browse the technical index"}</h1></div><form className="search-page-form"><input name="q" defaultValue={q} placeholder="Search product guides, datasheets and tools"/><button type="submit">Search</button></form><div className="search-results"><p>{results.length} indexed resources</p>{results.map((resource)=><a href={resource.url} target="_blank" rel="noreferrer" key={resource.id}><span>{resource.type}</span><h2>{resource.title}</h2><p>{resource.summary}</p><b>{resource.category} · Official site →</b></a>)}</div></main>;
}
