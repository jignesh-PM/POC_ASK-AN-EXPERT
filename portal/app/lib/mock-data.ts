export const categories = [
  { name: "Fibre Products", slug: "fibres", description: "Blankets, modules, boards and Superwool fibres", count: 24 },
  { name: "Refractories", slug: "refractories", description: "IFB, monolithics and refractory fired shapes", count: 18 },
  { name: "Microporous", slug: "microporous", description: "WDS boards and vacuum insulation panels", count: 12 },
  { name: "Passive Fire Protection", slug: "pfp", description: "FireMaster duct wraps and rated systems", count: 16 },
  { name: "Fire Assay", slug: "fire-assay", description: "Laboratory furnaces and operating manuals", count: 9 },
  { name: "Engineering & Services", slug: "engineering", description: "Design, assessment and installation supervision", count: 11 },
];

export const mainAreas = [
  { slug:"product-information", title: "Product Information", description: "Product lines, datasheets and technical papers", count: "6 product lines" },
  { slug:"product-installation", title: "Product Installation", description: "Installation, storage and dry-out manuals", count: "32 manuals" },
  { slug:"engineering-design", title: "Engineering & Design", description: "Thermal management and design support", count: "8 resources" },
  { slug:"lining-assessment", title: "Lining Assessment", description: "Inspection and IR assessment services", count: "5 services" },
  { slug:"supervision-service", title: "Supervision Service", description: "Expert installation and commissioning support", count: "4 options" },
  { slug:"pfp", title: "Passive Fire Protection", description: "PFP certificates, resources and systems", count: "16 resources" },
];

export const tools = [
  { slug:"heat-flow", title: "Heat Flow Calculation", description: "Estimate heat flow through refractory systems", type: "External tool" },
  { slug:"pfp-solution", title: "PFP Solution Finder", description: "Find the right passive fire protection solution", type: "External tool" },
  { slug:"pfp-certificates", title: "PFP Certificate Finder", description: "Search certificates by product, standard and region", type: "Portal tool", restricted: true },
  { slug:"co2-estimation", title: "CO₂ Emission Estimation", description: "Estimate potential carbon emissions reduction", type: "Portal tool", restricted: true },
];

export const documents = [
  { title: "Superwool® Plus Blanket datasheet", type: "Datasheet", line: "Fibres", updated: "Nov 2026" },
  { title: "Superwool XTRA 607 installation manual", type: "Installation manual", line: "Fibres", updated: "Oct 2026" },
  { title: "Microporous board WDS technical guide", type: "Technical paper", line: "Microporous", updated: "Sep 2026" },
  { title: "FireMaster duct wrap certificate", type: "Certificate", line: "PFP", updated: "Nov 2026" },
];
