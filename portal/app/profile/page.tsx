"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, Building2, Check, CircleUserRound, MapPin, Phone } from "@/app/components/Icon";
import PasswordSettings from "../components/PasswordSettings";
import { emptyProfileDetails, getProfileCompletion, profileStorageKey, profileUpdatedEvent, readProfileDetails, type ProfileDetails } from "../lib/profile-completion";

function ProfileField({ label, name, value, onChange, required = true, type = "text", autoComplete }: {
  label: string;
  name: keyof ProfileDetails;
  value: string;
  onChange: (name: keyof ProfileDetails, value: string) => void;
  required?: boolean;
  type?: string;
  autoComplete?: string;
}) {
  return <label>{label}{!required && <span className="profile-optional">Optional</span>}<input name={name} type={type} value={value} onChange={(event) => onChange(name, event.target.value)} required={required} autoComplete={autoComplete} /></label>;
}

export default function ProfilePage() {
  const [details, setDetails] = useState<ProfileDetails>(emptyProfileDetails);
  const [feedback, setFeedback] = useState("");
  const completion = getProfileCompletion(details);

  useEffect(() => setDetails(readProfileDetails()), []);

  const updateField = (name: keyof ProfileDetails, value: string) => {
    setDetails((current) => ({ ...current, [name]: value }));
    setFeedback("");
  };

  const saveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.localStorage.setItem(profileStorageKey, JSON.stringify(details));
    window.localStorage.setItem("morgan-profile-email", details.emailAddress.trim());
    window.dispatchEvent(new Event(profileUpdatedEvent));
    setFeedback("Your profile details have been saved.");
  };

  return (
    <main className="simple-page">
      <div className="simple-head">
        <p className="eyebrow">CUSTOMER PROFILE</p>
        <h1>Your profile</h1>
        <p>Keep your contact and organization details up to date for more relevant support.</p>
      </div>
      <section className="profile-page">
        <form className="profile-details-form" id="personal-details" onSubmit={saveProfile}>
          <div className="profile-form-heading">
            <span><CircleUserRound size={20} aria-hidden="true" /></span>
            <div><h2>Profile details</h2><p>{completion.completed} of {completion.total} required details complete</p></div>
            <strong>{completion.percent}%</strong>
          </div>
          <div className="profile-progress-track" role="progressbar" aria-label="Profile completion" aria-valuemin={0} aria-valuemax={100} aria-valuenow={completion.percent}><span style={{ width: `${completion.percent}%` }} /></div>

          <section className="profile-detail-section" aria-labelledby="profile-personal-heading">
            <div className="profile-section-title"><CircleUserRound size={17} aria-hidden="true" /><h3 id="profile-personal-heading">Personal details</h3></div>
            <div className="profile-fields-grid">
              <ProfileField label="Name" name="name" value={details.name} onChange={updateField} autoComplete="name" />
              <ProfileField label="Designation" name="designation" value={details.designation} onChange={updateField} autoComplete="organization-title" />
            </div>
          </section>

          <section className="profile-detail-section" aria-labelledby="profile-organization-heading">
            <div className="profile-section-title"><Building2 size={17} aria-hidden="true" /><h3 id="profile-organization-heading">Organization details</h3></div>
            <div className="profile-fields-grid">
              <ProfileField label="Organization name" name="organizationName" value={details.organizationName} onChange={updateField} autoComplete="organization" />
              <label>Organization size<select name="organizationSize" value={details.organizationSize} onChange={(event) => updateField("organizationSize", event.target.value)} required><option value="">Select organization size</option><option value="1â€“10">1â€“10 employees</option><option value="11â€“50">11â€“50 employees</option><option value="51â€“200">51â€“200 employees</option><option value="201â€“1,000">201â€“1,000 employees</option><option value="1,001â€“5,000">1,001â€“5,000 employees</option><option value="5,001+">5,001+ employees</option></select></label>
              <ProfileField label="Organization address" name="organizationAddress" value={details.organizationAddress} onChange={updateField} autoComplete="street-address" />
              <ProfileField label="Postal code" name="postalCode" value={details.postalCode} onChange={updateField} autoComplete="postal-code" />
              <ProfileField label="City" name="city" value={details.city} onChange={updateField} autoComplete="address-level2" />
              <ProfileField label="State / province" name="state" value={details.state} onChange={updateField} autoComplete="address-level1" />
            </div>
          </section>

          <section className="profile-detail-section" aria-labelledby="profile-contact-heading">
            <div className="profile-section-title"><Phone size={17} aria-hidden="true" /><h3 id="profile-contact-heading">Contact details</h3></div>
            <div className="profile-fields-grid">
              <ProfileField label="Mobile number" name="mobileNumber" value={details.mobileNumber} onChange={updateField} type="tel" autoComplete="tel" />
              <ProfileField label="Alternative number" name="alternativeNumber" value={details.alternativeNumber} onChange={updateField} required={false} type="tel" autoComplete="tel" />
              <ProfileField label="Email address" name="emailAddress" value={details.emailAddress} onChange={updateField} type="email" autoComplete="email" />
            </div>
          </section>
          <div className="profile-save-row"><p className={feedback ? "profile-save-feedback is-saved" : "profile-save-feedback"} role="status" aria-live="polite">{feedback || (completion.percent < 100 ? `${completion.missing.length} required details still need to be completed.` : "All required details are complete.")}</p><button type="submit"><Check size={16} aria-hidden="true" /> Save profile</button></div>
        </form>

        <PasswordSettings />
        <aside className="profile-data-card">
          <span className="profile-data-icon"><MapPin size={18} aria-hidden="true" /></span>
          <div className="profile-data-copy"><h2>Data &amp; consent</h2><p>Privacy notice accepted on 21 November 2026.</p><Link href="/privacy">Review privacy notice <ArrowRight size={14} aria-hidden="true" /></Link></div>
          <div className="profile-data-actions"><button type="button">Request data export</button><button className="danger" type="button">Request account deletion</button></div>
        </aside>
      </section>
    </main>
  );
}