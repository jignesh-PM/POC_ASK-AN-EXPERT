export type IndexedResource = {
  id: string;
  title: string;
  summary: string;
  category: string;
  type: "Datasheet" | "SDS" | "Installation manual" | "Technical paper" | "Certificate";
  locale: string;
  url: string;
  keywords: string[];
};

export const officialSiteIndex: IndexedResource[] = [
  { id:"sw-plus", title:"Superwool Plus Blanket datasheet", summary:"Technical properties, temperature limits and applications for Superwool Plus insulation blankets.", category:"Fibres", type:"Datasheet", locale:"en-gb", url:"https://www.morganthermalceramics.com/en-gb/products-systems/blankets/", keywords:["superwool","blanket","temperature","1260","datasheet"] },
  { id:"sw-xtra", title:"Superwool XTRA technical guide", summary:"High-performance fibre module and blanket information for demanding thermal applications.", category:"Fibres", type:"Technical paper", locale:"en-gb", url:"https://www.morganthermalceramics.com/en-gb/products-systems/papers/", keywords:["superwool","xtra","module","thermal"] },
  { id:"pyro", title:"Pyro-Bloc fibre modules installation manual", summary:"Installation guidance for folded and stacked Pyro-Bloc fibre modules.", category:"Fibres", type:"Installation manual", locale:"en-gb", url:"https://www.morganthermalceramics.com/en-gb/products-systems/modules/", keywords:["pyro","bloc","module","installation","folded","stacked"] },
  { id:"ifb", title:"Insulating Firebrick installation manual", summary:"Handling, mortar selection and installation requirements for insulating firebricks.", category:"Refractories", type:"Installation manual", locale:"en-gb", url:"https://www.morganthermalceramics.com/en-gb/products-systems/insulating-firebricks-firebricks-and-mortars/", keywords:["ifb","firebrick","mortar","installation"] },
  { id:"castable", title:"Castable dry-out instructions", summary:"Recommended dry-out schedules and procedures for monolithic castables.", category:"Refractories", type:"Installation manual", locale:"en-gb", url:"https://www.morganthermalceramics.com/en-gb/products-systems/monolithics/", keywords:["castable","dry out","dry-out","monolithic","cement"] },
  { id:"wds", title:"WDS microporous board datasheet", summary:"Properties and specification information for WDS microporous insulation boards.", category:"Microporous", type:"Datasheet", locale:"en-gb", url:"https://www.morganthermalceramics.com/en-gb/products-systems/microporous/", keywords:["wds","microporous","board","thermal conductivity","clearance"] },
  { id:"wds-manual", title:"WDS board installation manual", summary:"Board cutting, jointing and installation guidance for microporous insulation systems.", category:"Microporous", type:"Installation manual", locale:"en-gb", url:"https://www.morganthermalceramics.com/en-gb/products-systems/microporous/wds-microporous/", keywords:["wds","board","installation","joint","clearance"] },
  { id:"firemaster", title:"FireMaster duct wrap certificate", summary:"Fire rating information and certification for passive fire protection duct systems.", category:"FireMaster Passive Fire Protection", type:"Certificate", locale:"en-gb", url:"https://www.morganthermalceramics.com/en-gb/products-systems/fire-protection-solutions/firemaster-fire-rated-duct-wraps/", keywords:["firemaster","certificate","fire","duct","rating","pfp"] },
  { id:"pfp-guide", title:"FireMaster PFP technical guide", summary:"Overview of passive fire protection solutions, specifications and application selection.", category:"FireMaster Passive Fire Protection", type:"Technical paper", locale:"en-gb", url:"https://www.morganthermalceramics.com/en-gb/products-systems/fire-protection-solutions/", keywords:["passive","fire","protection","pfp","solution"] },
  { id:"storage", title:"Fibre product storage instructions", summary:"Storage and handling guidance to preserve fibre and insulation product performance.", category:"Fibres", type:"SDS", locale:"en-gb", url:"https://www.morganthermalceramics.com/en-gb/resources/", keywords:["storage","handling","sds","fibre","moisture"] },
  { id:"sds", title:"Safety datasheet library", summary:"Approved safety and product handling information for Morgan Thermal Ceramics materials.", category:"Safety", type:"SDS", locale:"en-gb", url:"https://www.morganthermalceramics.com/en-gb/resources/", keywords:["safety","sds","msds","handling","hazard"] },
  { id:"kiln", title:"Fire assay laboratory kiln datasheet", summary:"Specifications for laboratory fusion, ashing and sample drying equipment.", category:"Fire Assay", type:"Datasheet", locale:"en-gb", url:"https://www.morganthermalceramics.com/en-gb/products-systems/furnace-assay-equipment/", keywords:["kiln","laboratory","fusion","furnace","assay"] },
];

export function searchIndexedResources(query: string) {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return officialSiteIndex;
  return officialSiteIndex.map((resource) => {
    const haystack = `${resource.title} ${resource.summary} ${resource.category} ${resource.keywords.join(" ")}`.toLowerCase();
    const score = terms.reduce((total, term) => total + (haystack.includes(term) ? 1 : 0), 0);
    return { resource, score };
  }).filter((item) => item.score > 0).sort((a, b) => b.score - a.score).map((item) => item.resource);
}

export function getMockAiAnswer(query: string, resources: IndexedResource[]) {
  const top = resources[0];
  if (!top) return {
    answer: "I could not find an approved indexed source for that question. A Morgan expert can confirm the correct product and application.",
    sources: [],
  };
  return {
    answer: `Based on the Morgan-approved official-site index, start with “${top.title}”. ${top.summary} Confirm any safety-critical or application-specific limit with a Morgan expert before use.`,
    sources: resources.slice(0, 3),
  };
}
