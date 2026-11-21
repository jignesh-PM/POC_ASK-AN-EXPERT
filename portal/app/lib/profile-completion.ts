export type ProfileDetails = {
  name: string;
  designation: string;
  organizationName: string;
  organizationSize: string;
  organizationAddress: string;
  postalCode: string;
  city: string;
  state: string;
  mobileNumber: string;
  alternativeNumber: string;
  emailAddress: string;
};

export const profileStorageKey = "morgan-profile-details";
export const profileEmailStorageKey = "morgan-profile-email";
export const profileUpdatedEvent = "morgan-profile-updated";

export const profileRequiredFields: { key: keyof ProfileDetails; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "designation", label: "Designation" },
  { key: "organizationName", label: "Organization name" },
  { key: "organizationSize", label: "Organization size" },
  { key: "organizationAddress", label: "Organization address" },
  { key: "postalCode", label: "Postal code" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "mobileNumber", label: "Mobile number" },
  { key: "emailAddress", label: "Email address" },
];

export const emptyProfileDetails: ProfileDetails = {
  name: "",
  designation: "",
  organizationName: "",
  organizationSize: "",
  organizationAddress: "",
  postalCode: "",
  city: "",
  state: "",
  mobileNumber: "",
  alternativeNumber: "",
  emailAddress: "",
};

export function getProfileCompletion(profile: Partial<ProfileDetails>) {
  const completed = profileRequiredFields.filter(({ key }) => Boolean(profile[key]?.trim())).length;
  return {
    completed,
    total: profileRequiredFields.length,
    percent: Math.round((completed / profileRequiredFields.length) * 100),
    missing: profileRequiredFields.filter(({ key }) => !profile[key]?.trim()),
  };
}

export function readProfileDetails(): ProfileDetails {
  if (typeof window === "undefined") return emptyProfileDetails;
  try {
    const stored = window.localStorage.getItem(profileStorageKey);
    const parsed = stored ? JSON.parse(stored) as Partial<ProfileDetails> : {};
    const loginEmail = window.localStorage.getItem(profileEmailStorageKey) ?? "";
    return { ...emptyProfileDetails, ...parsed, emailAddress: parsed.emailAddress || loginEmail };
  } catch {
    return { ...emptyProfileDetails, emailAddress: window.localStorage.getItem(profileEmailStorageKey) ?? "" };
  }
}
