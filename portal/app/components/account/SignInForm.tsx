"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, Mail, ShieldCheck } from "../Icon";
import { Alert, Button, Card, Checkbox, Field, Input, cx } from "../ui";
import styles from "./SignIn.module.css";
import { setRole, useAdminSettings } from "@/app/lib/session";
import { setLoginEmail } from "@/app/lib/profile-completion";

type Mode = "signin" | "signup";
type Step = "email" | "code" | "forgot" | "reset-sent";

const COPY: Record<Step, (email: string, mode: Mode) => { title: string; description: string }> = {
  email: (_, mode) => ({
    title: mode === "signin" ? "Welcome back" : "Create your account",
    description: "Sign in securely to access your technical resources and expert support.",
  }),
  code: (email) => ({ title: "Check your email", description: `Enter the six-digit passcode sent to ${email}.` }),
  forgot: () => ({ title: "Reset your password", description: "Enter your work email and we'll send password reset instructions." }),
  "reset-sent": (email) => ({ title: "Check your email", description: `If a password-based account exists for ${email}, reset instructions are on the way.` }),
};

/** One-time-passcode sign in, sign up, password reset and Microsoft sign-in for Morgan staff. */
export default function SignInForm() {
  const router = useRouter();
  const { signupEnabled } = useAdminSettings();
  const [selectedMode, setSelectedMode] = useState<Mode>("signin");
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [code, setCode] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [notice, setNotice] = useState("");

  // Sign-up disappears as soon as an admin disables it.
  const mode: Mode = signupEnabled ? selectedMode : "signin";
  const { title, description } = COPY[step](email, mode);

  const goTo = (next: Step) => {
    setStep(next);
    setCode("");
    setNotice("");
  };

  const finish = (role: "Customer" | "Morgan User") => {
    setLoginEmail(email);
    setRole(role);
    router.push(role === "Morgan User" ? "/expert" : "/");
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (step === "forgot") goTo("reset-sent");
    else if (step === "email") goTo("code");
    else if (step === "code" && code.length === 6) finish("Customer");
  };

  return (
    <Card as="section" padding="lg" className={styles.card} aria-labelledby="auth-title">
      <div className={styles.head}>
        <h2 id="auth-title" className={styles.title}>
          {title}
        </h2>
        <p className={styles.description}>{description}</p>
      </div>

      {step === "email" && signupEnabled && (
        <div className={styles.switch} role="group" aria-label="Account action">
          {(["signin", "signup"] as const).map((option) => (
            <button
              key={option}
              type="button"
              className={cx(styles.switchOption, mode === option && styles.switchActive)}
              aria-pressed={mode === option}
              onClick={() => {
                setSelectedMode(option);
                goTo("email");
              }}
            >
              {option === "signin" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>
      )}

      {step === "reset-sent" ? (
        <div className={styles.form}>
          <Alert tone="success" icon={<Check size={18} aria-hidden="true" />}>
            <strong>Reset instructions requested.</strong> Check your inbox and spam folder.
          </Alert>
          <div className={styles.row}>
            <Button variant="ghost" size="sm" leading={<ArrowLeft size={16} aria-hidden="true" />} onClick={() => goTo("email")}>
              Back to sign in
            </Button>
            <Button variant="link" size="sm" onClick={() => setNotice("Reset instructions requested again.")}>
              Resend email
            </Button>
          </div>
        </div>
      ) : (
        <form className={styles.form} onSubmit={submit}>
          {step === "code" ? (
            <>
              <Field label="Six-digit passcode">
                <Input
                  className={styles.otp}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  placeholder="000000"
                  value={code}
                  onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                  required
                  autoFocus
                />
              </Field>
              <Button type="submit" size="lg" fullWidth disabled={code.length !== 6} trailing={<ArrowRight size={16} aria-hidden="true" />}>
                Verify and continue
              </Button>
              <div className={styles.row}>
                <Button variant="ghost" size="sm" leading={<ArrowLeft size={16} aria-hidden="true" />} onClick={() => goTo("email")}>
                  Back to email
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => {
                    setCode("");
                    setNotice("A new passcode has been sent to your email.");
                  }}
                >
                  Resend passcode
                </Button>
              </div>
            </>
          ) : (
            <>
              {step === "email" && mode === "signup" && (
                <Field label="Full name">
                  <Input type="text" placeholder="Alex Morgan" autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} required />
                </Field>
              )}
              <Field label="Work email">
                <Input type="email" placeholder="you@company.com" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </Field>
              {step === "email" && mode === "signup" && (
                <Checkbox
                  checked={acceptedTerms}
                  onChange={(event) => setAcceptedTerms(event.target.checked)}
                  required
                  label={
                    <>
                      I accept the <Link href="/privacy" className={styles.textLink}>Privacy Notice</Link> and <Link href="/terms" className={styles.textLink}>Terms of Use</Link>.
                    </>
                  }
                />
              )}
              <Button type="submit" size="lg" fullWidth trailing={<ArrowRight size={16} aria-hidden="true" />}>
                {step === "forgot" ? "Send reset instructions" : mode === "signup" ? "Create account" : "Continue with email"}
              </Button>
              {step === "forgot" ? (
                <Button variant="ghost" size="sm" className={styles.center} leading={<ArrowLeft size={16} aria-hidden="true" />} onClick={() => goTo("email")}>
                  Back to sign in
                </Button>
              ) : (
                <>
                  <p className={styles.secure}>
                    <ShieldCheck size={16} aria-hidden="true" /> Password-free sign-in with a one-time passcode
                  </p>
                  {mode === "signin" && (
                    <Button variant="link" size="sm" className={styles.center} onClick={() => goTo("forgot")}>
                      Forgot password?
                    </Button>
                  )}
                </>
              )}
            </>
          )}
        </form>
      )}

      <p className={styles.notice} role="status">
        {notice}
      </p>

      {step === "email" && mode === "signin" && (
        <div className={styles.secondary}>
          <p className={styles.divider}>Morgan users</p>
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={() => finish("Morgan User")}
            leading={
              <span className={styles.microsoft} aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </span>
            }
            trailing={<ArrowRight size={16} aria-hidden="true" />}
          >
            Continue with Microsoft
          </Button>
        </div>
      )}

      <p className={styles.privacy}>
        <Mail size={14} aria-hidden="true" /> Your information is handled in line with Morgan&apos;s privacy standards.
      </p>
    </Card>
  );
}
