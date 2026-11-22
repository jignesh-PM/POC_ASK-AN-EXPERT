export const DEFAULT_REGION = "EMEA";
export const DEFAULT_LANGUAGE = "English";

export const REGIONS = [
  { value: "EMEA", label: "Europe, Middle East & Africa", short: "EMEA" },
  { value: "Americas", label: "North, Central & South America", short: "Americas" },
  { value: "Asia Pacific", label: "Asia and Pacific markets", short: "Asia Pacific" },
  { value: "Australia", label: "Australia and New Zealand", short: "Australia" },
] as const;

export const LANGUAGES = [
  { value: "English", label: "English" },
  { value: "Deutsch", label: "German" },
  { value: "Français", label: "French" },
  { value: "Español", label: "Spanish" },
] as const;
