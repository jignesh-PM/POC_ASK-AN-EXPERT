"use client";

import { useState, type ReactNode } from "react";
import { Building2, Check, Phone, UserRound } from "../Icon";
import { Button, Card, Field, Input, SectionHeader, Select } from "../ui";
import styles from "./Account.module.css";
import { getProfileCompletion, saveProfileDetails, useProfileDetails, type ProfileDetails } from "@/app/lib/profile-completion";

type FieldConfig = { name: keyof ProfileDetails; label: string; type?: string; autoComplete?: string; optional?: boolean };

const ORGANIZATION_SIZES = ["1–10", "11–50", "51–200", "201–1,000", "1,001–5,000", "5,001+"];

const SECTIONS: { id: string; title: string; icon: ReactNode; fields: FieldConfig[] }[] = [
  {
    id: "personal",
    title: "Personal details",
    icon: <UserRound size={18} />,
    fields: [
      { name: "name", label: "Name", autoComplete: "name" },
      { name: "designation", label: "Designation", autoComplete: "organization-title" },
    ],
  },
  {
    id: "organization",
    title: "Organization details",
    icon: <Building2 size={18} />,
    fields: [
      { name: "organizationName", label: "Organization name", autoComplete: "organization" },
      { name: "organizationSize", label: "Organization size" },
      { name: "organizationAddress", label: "Organization address", autoComplete: "street-address" },
      { name: "postalCode", label: "Postal code", autoComplete: "postal-code" },
      { name: "city", label: "City", autoComplete: "address-level2" },
      { name: "state", label: "State / province", autoComplete: "address-level1" },
    ],
  },
  {
    id: "contact",
    title: "Contact details",
    icon: <Phone size={18} />,
    fields: [
      { name: "mobileNumber", label: "Mobile number", type: "tel", autoComplete: "tel" },
      { name: "alternativeNumber", label: "Alternative number", type: "tel", autoComplete: "tel", optional: true },
      { name: "emailAddress", label: "Email address", type: "email", autoComplete: "email" },
    ],
  },
];

/** Editable profile with a live completion meter. */
export default function ProfileForm() {
  const stored = useProfileDetails();
  // `null` until the user edits, so the form always shows the latest stored details without an effect.
  const [draft, setDraft] = useState<ProfileDetails | null>(null);
  const [saved, setSaved] = useState(false);
  const details = draft ?? stored;
  const completion = getProfileCompletion(details);

  const update = (name: keyof ProfileDetails, value: string) => {
    setDraft({ ...details, [name]: value });
    setSaved(false);
  };

  const submit = (event: { preventDefault(): void }) => {
    event.preventDefault();
    saveProfileDetails(details);
    setDraft(null);
    setSaved(true);
  };

  const statusText = saved
    ? "Your profile details have been saved."
    : completion.percent < 100
      ? `${completion.missing.length} required ${completion.missing.length === 1 ? "detail still needs" : "details still need"} to be completed.`
      : "All required details are complete.";

  return (
    <Card as="form" id="personal-details" onSubmit={submit} padding="lg" aria-labelledby="profile-form-heading">
      <div className={styles.cardHead}>
        <SectionHeader
          id="profile-form-heading"
          title="Profile details"
          description={`${completion.completed} of ${completion.total} required details complete`}
          className={styles.cardHeadCopy}
          actions={<strong className={styles.percent}>{completion.percent}%</strong>}
        />
      </div>
      <div className={styles.meter} role="progressbar" aria-label="Profile completion" aria-valuemin={0} aria-valuemax={100} aria-valuenow={completion.percent}>
        <span className={styles.meterFill} style={{ width: `${completion.percent}%` }} />
      </div>

      {SECTIONS.map((section) => (
        <fieldset key={section.id} className={styles.section}>
          <legend className={styles.legend}>
            <span className={styles.legendIcon} aria-hidden="true">
              {section.icon}
            </span>
            {section.title}
          </legend>
          <div className={styles.fields}>
            {section.fields.map((field) => (
              <Field key={field.name} label={field.label} optional={field.optional}>
                {field.name === "organizationSize" ? (
                  <Select name={field.name} value={details.organizationSize} onChange={(event) => update("organizationSize", event.target.value)} required>
                    <option value="">Select organization size</option>
                    {ORGANIZATION_SIZES.map((size) => (
                      <option key={size} value={size}>
                        {size} employees
                      </option>
                    ))}
                  </Select>
                ) : (
                  <Input
                    name={field.name}
                    type={field.type ?? "text"}
                    autoComplete={field.autoComplete}
                    value={details[field.name]}
                    onChange={(event) => update(field.name, event.target.value)}
                    required={!field.optional}
                  />
                )}
              </Field>
            ))}
          </div>
        </fieldset>
      ))}

      <div className={styles.formFooter}>
        <p className={saved ? styles.saved : styles.note} role="status">
          {saved && <Check size={16} aria-hidden="true" />}
          {statusText}
        </p>
        <Button type="submit" leading={<Check size={16} aria-hidden="true" />}>
          Save profile
        </Button>
      </div>
    </Card>
  );
}
