"use client";

import { STORAGE_KEYS, readJSON, readString, useStoredJSON, useStoredString, writeJSON, writeString } from "./storage";

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

const EMPTY: Partial<ProfileDetails> = {};

export function getProfileCompletion(profile: Partial<ProfileDetails>) {
  const missing = profileRequiredFields.filter(({ key }) => !profile[key]?.trim());
  const completed = profileRequiredFields.length - missing.length;
  return {
    completed,
    total: profileRequiredFields.length,
    percent: Math.round((completed / profileRequiredFields.length) * 100),
    missing,
  };
}

function merge(saved: Partial<ProfileDetails>, loginEmail: string | null): ProfileDetails {
  return { ...emptyProfileDetails, ...saved, emailAddress: saved.emailAddress || loginEmail || "" };
}

export function useProfileDetails(): ProfileDetails {
  const saved = useStoredJSON(STORAGE_KEYS.profile, EMPTY);
  const loginEmail = useStoredString(STORAGE_KEYS.profileEmail);
  return merge(saved, loginEmail);
}

export function readProfileDetails(): ProfileDetails {
  return merge(readJSON(STORAGE_KEYS.profile, EMPTY), readString(STORAGE_KEYS.profileEmail));
}

export function useProfileCompletion() {
  return getProfileCompletion(useProfileDetails());
}

export function saveProfileDetails(details: ProfileDetails) {
  writeJSON(STORAGE_KEYS.profile, details);
  writeString(STORAGE_KEYS.profileEmail, details.emailAddress.trim());
}

export function setLoginEmail(email: string) {
  if (email.trim()) writeString(STORAGE_KEYS.profileEmail, email.trim());
}
