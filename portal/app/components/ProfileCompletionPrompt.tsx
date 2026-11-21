"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CircleUserRound } from "lucide-react";
import { getProfileCompletion, profileUpdatedEvent, readProfileDetails } from "../lib/profile-completion";

export default function ProfileCompletionPrompt() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [completion, setCompletion] = useState(() => getProfileCompletion({}));

  useEffect(() => {
    const sync = () => {
      setIsLoggedIn((window.localStorage.getItem("prototype-role") || "Visitor") !== "Visitor");
      setCompletion(getProfileCompletion(readProfileDetails()));
    };
    sync();
    window.addEventListener("prototype-role-change", sync);
    window.addEventListener(profileUpdatedEvent, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("prototype-role-change", sync);
      window.removeEventListener(profileUpdatedEvent, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  if (!isLoggedIn || completion.percent === 100) return null;

  return (
    <section className="profile-completion-prompt" aria-labelledby="profile-completion-title">
      <span className="profile-completion-icon"><CircleUserRound size={20} aria-hidden="true" /></span>
      <div className="profile-completion-copy">
        <p className="profile-completion-kicker">COMPLETE YOUR PROFILE</p>
        <h2 id="profile-completion-title">Help us tailor your Morgan experience</h2>
        <p>{completion.missing.length} details remaining: {completion.missing.slice(0, 3).map((field) => field.label.toLowerCase()).join(", ")}{completion.missing.length > 3 ? ` and ${completion.missing.length - 3} more` : ""}.</p>
      </div>
      <div className="profile-completion-progress"><div><strong>{completion.percent}%</strong><span>{completion.completed} of {completion.total} complete</span></div><div className="profile-progress-track" role="progressbar" aria-label="Profile completion" aria-valuemin={0} aria-valuemax={100} aria-valuenow={completion.percent}><span style={{ width: `${completion.percent}%` }} /></div></div>
      <Link className="profile-completion-action" href="/profile#personal-details">Complete profile <ArrowRight size={16} aria-hidden="true" /></Link>
    </section>
  );
}
