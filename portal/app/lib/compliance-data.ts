export const qualityCertificatesUrl = "https://www.morganthermalceramics.com/en-gb/about-us/integrated-quality-management-systems/";
export const morganLocationsUrl = "https://www.morganthermalceramics.com/en-gb/our-locations/";

export type RegionalCertification = {
  id: string;
  standard: "ISO 9001" | "ISO 14001" | "ISO 45001";
  name: string;
  locations: string[];
};

export const regionalCertifications: Record<string, { label: string; sourceRegion: string; certifications: RegionalCertification[] }> = {
  EMEA: {
    label: "Europe, Middle East & Africa",
    sourceRegion: "EMEA",
    certifications: [
      { id: "iso-9001", standard: "ISO 9001", name: "Quality management", locations: ["Windsor, England", "Bromborough, England", "Reinbek, Germany", "Kempten, Germany", "Casalpusterlengo, Italy", "Gliwice, Poland", "Lillebonne, France", "Saint-Marcellin, France", "Thouarcé, France", "Kizad, United Arab Emirates"] },
      { id: "iso-14001", standard: "ISO 14001", name: "Environmental management", locations: ["Bromborough, England", "Saint-Marcellin, France", "Thouarcé, France", "Lillebonne, France", "Casalpusterlengo, Italy", "Kempten, Germany", "Kizad, United Arab Emirates"] },
      { id: "iso-45001", standard: "ISO 45001", name: "Occupational health & safety", locations: ["Windsor, England", "Thouarcé, France", "Lillebonne, France", "Saint-Marcellin, France", "Casalpusterlengo, Italy", "Kizad, United Arab Emirates"] },
    ],
  },
  Americas: {
    label: "Americas",
    sourceRegion: "Americas",
    certifications: [
      { id: "iso-9001", standard: "ISO 9001", name: "Quality management", locations: ["Ontario, Canada", "Elkhart, Indiana", "Girard, Illinois", "Emporia, Kansas", "Augusta, Georgia", "Hidalgo, Mexico", "Santiago, Chile", "San Luis, Argentina"] },
      { id: "iso-14001", standard: "ISO 14001", name: "Environmental management", locations: ["Ontario, Canada", "Elkhart, Indiana", "Augusta, Georgia", "Hidalgo, Mexico", "San Luis, Argentina"] },
    ],
  },
  "Asia Pacific": {
    label: "Asia Pacific",
    sourceRegion: "Asia",
    certifications: [
      { id: "iso-9001", standard: "ISO 9001", name: "Quality management", locations: ["Jingmen, China", "Shanghai, China", "Gujarat, India", "Tamil Nadu, India", "Osaka, Japan", "Daegu, South Korea", "Yixing City, China", "Uttar Pradesh, India"] },
      { id: "iso-14001", standard: "ISO 14001", name: "Environmental management", locations: ["Tamil Nadu, India", "Shanghai, China", "Daegu, South Korea", "Osaka, Japan", "Gujarat, India", "Yixing, China", "Jingmen, China"] },
      { id: "iso-45001", standard: "ISO 45001", name: "Occupational health & safety", locations: ["Gujarat, India", "Tamil Nadu, India", "Yixing, China"] },
    ],
  },
  Australia: {
    label: "Australia",
    sourceRegion: "Australia",
    certifications: [],
  },
};

export const regionOptions = Object.entries(regionalCertifications).map(([id, region]) => ({ id, label: region.label }));
