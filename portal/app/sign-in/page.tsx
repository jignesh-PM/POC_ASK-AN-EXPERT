"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignIn() {
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState("");
  return (
    <main className="auth-page">
      <div className="auth-side"><Link href="/" className="auth-brand">M Morgan <b>Advanced Materials</b></Link><div><p>THERMAL CERAMICS</p><h1>Technical expertise.<br/>One simple portal.</h1></div></div>
      <div className="auth-form-wrap">
        <Link href="/" className="back-link">← Back to portal</Link>
        <div className="auth-form">
          <p className="section-kicker">CUSTOMER ACCESS</p>
          <h1>{sent ? "Enter your code" : "Sign in or sign up"}</h1>
          <p>{sent ? "We sent a 6-digit passcode to your email. It expires in 10 minutes." : "Access technical resources and ask Morgan's experts for help."}</p>
          {!sent ? <>
            <label>Email address<input type="email" placeholder="you@company.com" /></label>
            <label>Full name (new customers)<input type="text" placeholder="Alex Morgan" /></label>
            <label className="check-row"><input type="checkbox"/><span>I accept the <Link href="/privacy">Privacy Notice</Link> and <Link href="/terms">Terms of Use</Link>.</span></label>
            <button className="auth-submit" type="button" onClick={() => setSent(true)}>Send secure passcode</button>
          </> : <>
            <div className="otp-row">{[0,1,2,3,4,5].map((n)=><input key={n} maxLength={1} value={code[n] || ""} onChange={(e)=>setCode(code.slice(0,n)+e.target.value+code.slice(n+1))}/>)}</div>
            <Link className="auth-submit" href="/">Verify and continue</Link>
            <button className="resend-button" type="button" onClick={() => setSent(false)}>Use a different email</button>
          </>}
        </div>
      </div>
    </main>
  );
}
