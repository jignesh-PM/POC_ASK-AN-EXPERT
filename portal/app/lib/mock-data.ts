export const categories = [
  { name: "Fibres", slug: "fibres", description: "Blankets, modules, boards, papers and high-temperature fibre systems" },
  { name: "Refractories", slug: "refractories", description: "IFB, monolithics and refractory fired shapes" },
  { name: "Microporous", slug: "microporous", description: "WDS products and vacuum insulation panels" },
  { name: "FireMaster Passive Fire Protection", slug: "pfp", description: "FireMaster fire protection systems" },
  { name: "Fire Assay", slug: "fire-assay", description: "Furnaces and equipment for laboratory workflows" },
];

export const industries = [
  { id: "steel", name: "Metals & steel" },
  { id: "petrochemicals", name: "Petrochemical & refining" },
  { id: "power", name: "Power generation" },
  { id: "cement", name: "Cement & lime" },
  { id: "glass", name: "Glass & ceramics" },
  { id: "construction", name: "Construction & fire protection" },
  { id: "laboratory", name: "Laboratory & fire assay" },
  { id: "other", name: "Other / not sure" },
];

export const productMasters = [
  { id: "fibres", name: "Fibres", officialUrl: "https://www.morganthermalceramics.com/en-gb/products-systems/", expertTeam: "Fibre Products team", industryIds: ["steel", "petrochemicals", "power", "cement", "glass"], subcategories: [
    { id: "battery-safety-papers", name: "Battery Safety Papers", url: "https://www.morganthermalceramics.com/en-gb/products-systems/battery-safety-papers/", description: "Thermal barrier papers designed for battery safety and energy storage." },
    { id: "papers", name: "Papers", url: "https://www.morganthermalceramics.com/en-gb/products-systems/papers/", description: "Flexible, high-temperature fibre papers for thermal management." },
    { id: "blankets", name: "Blankets", url: "https://www.morganthermalceramics.com/en-gb/products-systems/blankets/", description: "High-performance thermal insulation blankets for industrial applications." },
    { id: "modules", name: "Modules", url: "https://www.morganthermalceramics.com/en-gb/products-systems/modules/", description: "High-temperature fibre modules for furnace, kiln and boiler linings." },
    { id: "ees-system", name: "EES System", url: "https://www.morganthermalceramics.com/en-gb/products-systems/ees-system/", description: "Electric element support systems for industrial heating applications." },
    { id: "boards-and-shapes", name: "Boards and Shapes", url: "https://www.morganthermalceramics.com/en-gb/products-systems/boards-and-shapes/", description: "Fibre boards and custom shapes for thermal management." },
    { id: "bulk-fibres", name: "Bulk Fibres", url: "https://www.morganthermalceramics.com/en-gb/products-systems/bulk-fibres/", description: "Bulk fibre materials for high-temperature insulation applications." },
    { id: "coatings-and-mastics", name: "Coatings and Mastics", url: "https://www.morganthermalceramics.com/en-gb/products-systems/coatings-and-mastics/", description: "Coatings and mastics for fibre and refractory systems." },
    { id: "felts", name: "Felts", url: "https://www.morganthermalceramics.com/en-gb/products-systems/felts/", description: "Flexible fibre felt products for insulation and sealing applications." },
    { id: "heat-shields", name: "Heat Shields", url: "https://www.morganthermalceramics.com/en-gb/products-systems/heat-shields/", description: "Thermal protection solutions for industrial and transportation uses." },
  ] },
  { id: "refractories", name: "Refractories", officialUrl: "https://www.morganthermalceramics.com/en-gb/products-systems/", expertTeam: "Refractories team", industryIds: ["steel", "petrochemicals", "power", "cement", "glass"], subcategories: [
    { id: "firebricks", name: "Insulating Firebricks, Firebricks and Mortars", url: "https://www.morganthermalceramics.com/en-gb/products-systems/insulating-firebricks-firebricks-and-mortars/", description: "Insulating and high-alumina firebricks for demanding thermal environments." },
    { id: "monolithics", name: "Monolithics", url: "https://www.morganthermalceramics.com/en-gb/products-systems/monolithics/", description: "Engineered monolithic materials for primary and backup linings." },
    { id: "refractory-fired-shapes", name: "Refractory Fired Shapes", url: "https://www.morganthermalceramics.com/en-gb/products-systems/refractory-fired-shapes/", description: "High-alumina and silicon-carbide shapes for high-temperature metal applications." },
  ] },
  { id: "microporous", name: "Microporous", officialUrl: "https://www.morganthermalceramics.com/en-gb/products-systems/microporous/", expertTeam: "Microporous team", industryIds: ["steel", "petrochemicals", "power", "construction"], subcategories: [
    { id: "wds-microporous", name: "Microporous", url: "https://www.morganthermalceramics.com/en-gb/products-systems/microporous/", description: "WDS and Min-K microporous products for space-constrained thermal management." },
    { id: "vacuum-insulation-panels", name: "Vacuum Insulation Panels (VIP)", url: "https://www.morganthermalceramics.com/en-gb/products-systems/vacuum-insulation-panels-vip/", description: "Vacupor vacuum insulation panels for low-temperature applications." },
  ] },
  { id: "pfp", name: "FireMaster Passive Fire Protection", officialUrl: "https://www.morganthermalceramics.com/en-gb/products-systems/fire-protection-solutions/", expertTeam: "Passive Fire Protection team", industryIds: ["petrochemicals", "power", "construction"], subcategories: [
    { id: "fire-protection-solutions", name: "Fire Protection Solutions", url: "https://www.morganthermalceramics.com/en-gb/products-systems/fire-protection-solutions/", description: "Certified passive fire protection products and systems." },
    { id: "firemaster-duct-wraps", name: "FireMaster Fire Rated Duct Wraps", url: "https://www.morganthermalceramics.com/en-gb/products-systems/fire-protection-solutions/firemaster-fire-rated-duct-wraps/", description: "Fire-rated duct wrap systems tested to international standards." },
  ] },
  { id: "fire-assay", name: "Fire Assay Equipment", officialUrl: "https://www.morganthermalceramics.com/en-gb/products-systems/furnace-assay-equipment/", expertTeam: "Fire Assay team", industryIds: ["laboratory", "other"], subcategories: [
    { id: "assay-fusion-furnace", name: "Assay Crucible Fusion Furnace", url: "https://www.morganthermalceramics.com/en-gb/products-systems/furnace-assay-equipment/", description: "Fusion furnace systems for fire assay and laboratory workflows." },
    { id: "assay-cupellation-furnace", name: "Assay Cupellation Furnace", url: "https://www.morganthermalceramics.com/en-gb/products-systems/furnace-assay-equipment/", description: "Cupellation furnaces for fire assay laboratory operations." },
    { id: "assay-calcine-ashing-roasting", name: "Calcine, Ashing & Roasting Furnace", url: "https://www.morganthermalceramics.com/en-gb/products-systems/furnace-assay-equipment/", description: "Laboratory furnaces for calcining, ashing and roasting samples." },
    { id: "sample-drying-oven", name: "Sample Drying Oven & Laboratory Kiln", url: "https://www.morganthermalceramics.com/en-gb/products-systems/furnace-assay-equipment/", description: "Drying ovens and laboratory kilns for sample preparation." },
  ] },
];

export const products = productMasters.flatMap((master) => master.subcategories.map((subcategory) => ({
  ...subcategory,
  category: master.id,
  categoryName: master.name,
  industryIds: master.industryIds,
  expertTeam: master.expertTeam,
})));

export const mainAreas = [
  { slug: "product-information", title: "Product Information", description: "Product lines, datasheets and technical papers" },
  { slug: "product-installation", title: "Product Installation", description: "Installation, storage and dry-out manuals" },
  { slug: "engineering-design", title: "Engineering & Design", description: "Thermal management and design support" },
  { slug: "lining-assessment", title: "Lining Assessment", description: "Inspection and IR assessment services" },
  { slug: "supervision-service", title: "Supervision Service", description: "Expert installation and commissioning support" },
  { slug: "pfp", title: "Passive Fire Protection", description: "PFP certificates, resources and systems" },
];

export type Tool = { slug: string; title: string; description: string; type: "External tool" | "Portal tool"; restricted?: boolean };

export const tools: Tool[] = [
  { slug: "heat-flow", title: "Heat Flow Calculation", description: "Estimate heat flow through refractory systems", type: "External tool" },
  { slug: "pfp-solution", title: "PFP Solution Finder", description: "Find the right passive fire protection solution", type: "External tool" },
  { slug: "pfp-certificates", title: "PFP Certificate Finder", description: "Search certificates by product, standard and region", type: "Portal tool", restricted: true },
  { slug: "co2-estimation", title: "CO₂ Emission Estimation", description: "Estimate potential carbon emissions reduction", type: "Portal tool", restricted: true },
];

