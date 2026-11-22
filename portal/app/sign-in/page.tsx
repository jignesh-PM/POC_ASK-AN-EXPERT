"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { profileEmailStorageKey } from "../lib/profile-completion";

type SignInMode = "signin" | "signup";

export default function SignIn() {
  const router = useRouter();
  const [mode, setMode] = useState<SignInMode>("signin");
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [code, setCode] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetRequested, setResetRequested] = useState(false);
  const [signupEnabled, setSignupEnabled] = useState(true);

  useEffect(() => {
    try {
      const settings = JSON.parse(window.localStorage.getItem("morgan-admin-settings") || "{}") as { signupEnabled?: boolean };
      setSignupEnabled(settings.signupEnabled !== false);
      if (settings.signupEnabled === false) setMode("signin");
    } catch { setSignupEnabled(true); }
  }, []);

  const finishSignIn = (role: "Customer" | "Morgan User") => {
    window.localStorage.setItem("prototype-role", role);
    if (email.trim()) window.localStorage.setItem(profileEmailStorageKey, email.trim());
    window.dispatchEvent(new Event("prototype-role-change"));
    router.push(role === "Morgan User" ? "/expert" : "/");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (forgotPassword) {
      setResetRequested(true);
      return;
    }
    if (!sent) {
      setSent(true);
      return;
    }
    if (code.length === 6) finishSignIn("Customer");
  };

  const changeMode = (nextMode: SignInMode) => {
    if (nextMode === "signup" && !signupEnabled) return;
    setMode(nextMode);
    setSent(false);
    setCode("");
    setForgotPassword(false);
    setResetRequested(false);
    setResendMessage("");
  };

  const startPasswordReset = () => {
    setForgotPassword(true);
    setResetRequested(false);
    setSent(false);
    setResendMessage("");
  };

  const returnToSignIn = () => {
    setForgotPassword(false);
    setResetRequested(false);
    setResendMessage("");
  };

  return (
    <main className="auth-page auth-page-enhanced">
      <section className="auth-form-wrap auth-form-panel" aria-label="Sign in or create an account">
        <div className="auth-form">
          <h1>{resetRequested ? "Check your email" : forgotPassword ? "Reset your password" : sent ? "Check your email" : mode === "signin" ? "Welcome back" : "Create your account"}</h1>
          <p>{resetRequested ? `If a password-based account exists for ${email}, reset instructions are on the way.` : forgotPassword ? "Enter your work email and we’ll send password reset instructions." : sent ? `Enter the six-digit passcode sent to ${email}.` : "Sign in securely to access your technical resources and expert support."}</p>

          {!sent && !forgotPassword && <div className="auth-mode-switch" role="group" aria-label="Account action">
            <button className={mode === "signin" ? "active" : ""} type="button" aria-pressed={mode === "signin"} onClick={() => changeMode("signin")}>Sign in</button>
            {signupEnabled && <button className={mode === "signup" ? "active" : ""} type="button" aria-pressed={mode === "signup"} onClick={() => changeMode("signup")}>Create account</button>}
          </div>}

          <form className="auth-entry-form" onSubmit={handleSubmit}>
            {resetRequested ? <div className="auth-reset-confirmation" role="status"><span aria-hidden="true">✓</span><strong>Reset instructions requested</strong><p>Check your inbox and spam folder. You can request another email or return to sign in.</p><div><button className="auth-code-back" type="button" onClick={returnToSignIn}>Back to sign in</button><button className="auth-code-resend" type="button" onClick={() => setResendMessage("Reset instructions requested again.")}>Resend email</button></div><p className="auth-resend-feedback" aria-live="polite">{resendMessage}</p></div> : forgotPassword ? <>
              <label>Work email<input type="email" placeholder="you@company.com" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
              <button className="auth-submit" type="submit">Send reset instructions<span aria-hidden="true">→</span></button>
              <button className="auth-code-back auth-forgot-back" type="button" onClick={returnToSignIn}><span aria-hidden="true">←</span> Back to sign in</button>
            </> : !sent ? <>
              {mode === "signup" && <label>Full name<input type="text" placeholder="Alex Morgan" autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} required /></label>}
              <label>Work email<input type="email" placeholder="you@company.com" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
              {mode === "signup" && <label className="check-row"><input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} required /><span>I accept the <Link href="/privacy">Privacy Notice</Link> and <Link href="/terms">Terms of Use</Link>.</span></label>}
              <button className="auth-submit" type="submit">{mode === "signup" ? "Create account" : "Continue with email"}<span aria-hidden="true">→</span></button>
              <p className="auth-secure-note"><span aria-hidden="true">✓</span> Password-free sign-in with a one-time passcode</p>
              {mode === "signin" && <button className="auth-forgot-link" type="button" onClick={startPasswordReset}>Forgot password?</button>}
            </> : <>
              <label>Six-digit passcode<input className="auth-code-input" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} placeholder="000000" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} required autoFocus /></label>
              <button className="auth-submit" type="submit" disabled={code.length !== 6}>Verify and continue<span aria-hidden="true">→</span></button>
              <div className="auth-code-actions">
                <button className="auth-code-back" type="button" onClick={() => { setSent(false); setCode(""); setResendMessage(""); }}><span aria-hidden="true">←</span> Back to email</button>
                <button className="auth-code-resend" type="button" onClick={() => { setCode(""); setResendMessage("A new passcode has been sent to your email."); }}>Resend OTP</button>
              </div>
              <p className="auth-resend-feedback" aria-live="polite">{resendMessage}</p>
            </>}
          </form>
          {!sent && !forgotPassword && mode === "signin" && <div className="auth-secondary-login">
            <div className="auth-divider"><span>Morgan users</span></div>
            <button className="microsoft-signin" type="button" onClick={() => finishSignIn("Morgan User")}>
              <span className="microsoft-mark" aria-hidden="true"><i /><i /><i /><i /></span>
              <span>Continue with Microsoft</span>
              <span className="microsoft-arrow" aria-hidden="true">→</span>
            </button>
          </div>}
        </div>
        <p className="auth-privacy-note">Your information is handled in line with Morgan’s privacy standards.</p>
      </section>
    </main>
  );
}
