"use client";

import { FormEvent, useState } from "react";
import { Eye, EyeOff, KeyRound, ShieldCheck } from "lucide-react";

export default function PasswordSettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackKind, setFeedbackKind] = useState<"success" | "error">("success");

  const updatePassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setFeedbackKind("error");
      setFeedback("The new passwords do not match. Check both fields and try again.");
      return;
    }
    if (currentPassword === newPassword) {
      setFeedbackKind("error");
      setFeedback("Choose a new password that is different from your current one.");
      return;
    }

    setFeedbackKind("success");
    setFeedback("Password update requested. Connect your Morgan account provider to apply this change.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <section className="password-settings" id="password-reset" aria-labelledby="password-settings-heading">
      <div className="password-settings-heading">
        <span><KeyRound size={18} aria-hidden="true" /></span>
        <div><h2 id="password-settings-heading">Password & security</h2><p>Update the password for your password-based account.</p></div>
        <button className="password-visibility" type="button" aria-pressed={showPasswords} onClick={() => setShowPasswords((visible) => !visible)}>
          {showPasswords ? <EyeOff size={15} aria-hidden="true" /> : <Eye size={15} aria-hidden="true" />}
          {showPasswords ? "Hide" : "Show"}
        </button>
      </div>

      <form className="password-settings-form" onSubmit={updatePassword}>
        <label>Current password<input type={showPasswords ? "text" : "password"} autoComplete="current-password" value={currentPassword} onChange={(event) => { setCurrentPassword(event.target.value); setFeedback(""); }} required /></label>
        <div className="password-settings-grid">
          <label>New password<input type={showPasswords ? "text" : "password"} autoComplete="new-password" minLength={12} value={newPassword} onChange={(event) => { setNewPassword(event.target.value); setFeedback(""); }} required /><small>Use at least 12 characters.</small></label>
          <label>Confirm new password<input type={showPasswords ? "text" : "password"} autoComplete="new-password" minLength={12} value={confirmPassword} onChange={(event) => { setConfirmPassword(event.target.value); setFeedback(""); }} required /></label>
        </div>
        <div className="password-settings-footer"><span><ShieldCheck size={15} aria-hidden="true" /> Your password is not saved in this prototype.</span><button type="submit">Update password</button></div>
        <p className={`password-settings-feedback ${feedback ? `is-${feedbackKind}` : ""}`} role={feedbackKind === "error" ? "alert" : "status"} aria-live="polite">{feedback || ""}</p>
      </form>
    </section>
  );
}
