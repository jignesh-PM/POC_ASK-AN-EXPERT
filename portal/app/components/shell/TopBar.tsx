"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, ChevronRight, Eye, FileText, KeyRound, LogIn, LogOut, Mail, Menu, Phone, Sparkles, UserRound, X, ExternalLink, Compass } from "../Icon";
import { Button, Field, Popover, PopoverHeader, PopoverSection, Select, cx, popoverItemClassName } from "../ui";
import { ROLES, ROLE_LABELS, isRole, roleHome, setLanguage, setRegion, setRole, useLanguage, useRegion, useRole, type Role } from "../../lib/session";
import { useProfileCompletion } from "../../lib/profile-completion";
import { STORAGE_KEYS, useStoredString, writeString } from "../../lib/storage";
import { LANGUAGES, REGIONS } from "../../lib/locale";
import styles from "./Shell.module.css";

export default function TopBar({ menuOpen, onToggleMenu }: { menuOpen: boolean; onToggleMenu: () => void }) {
  const router = useRouter();
  const role = useRole();

  const switchRole = (next: Role) => {
    setRole(next);
    router.push(roleHome(next));
  };

  return (
    <div className={styles.topBar}>
      <button type="button" className={styles.iconButton} onClick={onToggleMenu} aria-expanded={menuOpen} aria-controls="main-navigation" aria-label={menuOpen ? "Close navigation" : "Open navigation"}>
        {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
      </button>
      <Link href="/" className={styles.brand} aria-label="Morgan Ask the Expert home">
        <Image src="/morgan-logo.png" alt="Morgan Advanced Materials" width={1149} height={336} priority className={styles.logo} />
        <span className={styles.productName}>Ask the Expert</span>
      </Link>

      <label className={styles.preview}>
        <Eye size={16} aria-hidden="true" />
        <span className={styles.previewLabel}>Preview as</span>
        <select value={role} onChange={(event) => isRole(event.target.value) && switchRole(event.target.value)} aria-label="Preview the portal as">
          {ROLES.map((item) => (
            <option key={item} value={item}>
              {ROLE_LABELS[item]}
            </option>
          ))}
        </select>
      </label>

      <div className={styles.utilities}>
        <ContactMenu />
        <NotificationsMenu role={role} />
        <AccountMenu role={role} onLogout={() => switchRole("Visitor")} />
      </div>
    </div>
  );
}

function ContactMenu() {
  return (
    <Popover label="Contact Morgan support" trigger={<Phone size={19} aria-hidden="true" />} triggerClassName={styles.iconButton}>
      {(close) => (
        <>
          <PopoverHeader icon={<Phone size={16} />} title="Quick contact" description="Reach the Morgan support team" />
          <PopoverSection>
            <a className={popoverItemClassName} href="mailto:AsktheExpert@morganplc.com" onClick={close}>
              <Mail size={18} aria-hidden="true" />
              <span>Email the expert team</span>
            </a>
            <a className={popoverItemClassName} href="https://www.morganthermalceramics.com/en-gb/contact-us/" target="_blank" rel="noreferrer" onClick={close}>
              <ExternalLink size={18} aria-hidden="true" />
              <span>Contact Morgan online</span>
            </a>
          </PopoverSection>
        </>
      )}
    </Popover>
  );
}

function NotificationsMenu({ role }: { role: Role }) {
  const welcomeRead = useStoredString(STORAGE_KEYS.welcomeRead) === "true";
  const completion = useProfileCompletion();
  const profileTask = role !== "Visitor" && completion.percent < 100;
  const count = Number(!welcomeRead) + Number(profileTask);

  return (
    <Popover
      label={count ? `Notifications, ${count} new` : "Notifications"}
      trigger={
        <>
          <Bell size={19} aria-hidden="true" />
          {count > 0 && <span className={styles.countBadge} aria-hidden="true">{count}</span>}
        </>
      }
      triggerClassName={styles.iconButton}
      onOpenChange={(open) => open && !welcomeRead && writeString(STORAGE_KEYS.welcomeRead, "true")}
    >
      {(close) => (
        <>
          <PopoverHeader icon={<Bell size={16} />} title="Notifications" description="Updates for your account" />
          <PopoverSection>
            {profileTask && (
              <Link className={cx(popoverItemClassName, styles.notification)} href="/profile#personal-details" onClick={close}>
                <UserRound size={18} aria-hidden="true" />
                <span>
                  <strong>Complete your profile · {completion.percent}%</strong>
                  <small>Add your organization and contact details to get the most from Morgan support.</small>
                </span>
                <ChevronRight size={16} aria-hidden="true" />
              </Link>
            )}
            <div className={cx(popoverItemClassName, styles.notification)}>
              <Sparkles size={18} aria-hidden="true" />
              <span>
                <strong>Welcome to Morgan Ask the Expert</strong>
                <small>Find documents, use tools, and connect with Morgan experts.</small>
              </span>
            </div>
          </PopoverSection>
        </>
      )}
    </Popover>
  );
}

function AccountMenu({ role, onLogout }: { role: Role; onLogout: () => void }) {
  const region = useRegion();
  const language = useLanguage();
  const completion = useProfileCompletion();
  const signedIn = role !== "Visitor";
  const showProgress = signedIn && completion.percent < 100;

  return (
    <Popover
      label={showProgress ? `Account and preferences, profile ${completion.percent}% complete` : "Account and preferences"}
      trigger={
        <span className={styles.avatar} style={{ "--progress": `${signedIn ? completion.percent : 0}%` } as React.CSSProperties} data-signed-in={signedIn}>
          <UserRound size={18} aria-hidden="true" />
        </span>
      }
      triggerClassName={styles.avatarButton}
    >
      {(close) => (
        <>
          <PopoverHeader icon={<UserRound size={16} />} title={signedIn ? ROLE_LABELS[role] : "Welcome"} description={signedIn ? "Signed in to the prototype" : "Sign in for expert chat and restricted tools"} />
          {!signedIn ? (
            <div className={styles.accountActions}>
              <Button href="/sign-in" size="sm" fullWidth leading={<LogIn size={16} aria-hidden="true" />} onClick={close}>
                Sign in
              </Button>
              <Button href="/sign-in" size="sm" variant="secondary" fullWidth onClick={close}>
                Create account
              </Button>
            </div>
          ) : (
            showProgress && (
              <PopoverSection>
                <Link className={popoverItemClassName} href="/profile#personal-details" onClick={close}>
                  <UserRound size={18} aria-hidden="true" />
                  <span>
                    Complete your profile
                    <span className={styles.meter} aria-hidden="true">
                      <span style={{ width: `${completion.percent}%` }} />
                    </span>
                  </span>
                  <strong className={styles.meterValue}>{completion.percent}%</strong>
                </Link>
              </PopoverSection>
            )
          )}
          <PopoverSection title="Preferences">
            <div className={styles.preferenceFields}>
              <Field label="Region">
                <Select value={region} onChange={(event) => setRegion(event.target.value)}>
                  {REGIONS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.value}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Language">
                <Select value={language} onChange={(event) => setLanguage(event.target.value)}>
                  {LANGUAGES.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.value}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
          </PopoverSection>
          <PopoverSection>
            {signedIn && (
              <>
                <Link className={popoverItemClassName} href="/profile" onClick={close}>
                  <UserRound size={18} aria-hidden="true" />
                  <span>My profile</span>
                </Link>
                <Link className={popoverItemClassName} href="/profile#password-reset" onClick={close}>
                  <KeyRound size={18} aria-hidden="true" />
                  <span>Password &amp; security</span>
                </Link>
              </>
            )}
            <Link className={popoverItemClassName} href="/technical-documents" onClick={close}>
              <FileText size={18} aria-hidden="true" />
              <span>Technical documents</span>
            </Link>
            <Link className={popoverItemClassName} href="/sitemap" onClick={close}>
              <Compass size={18} aria-hidden="true" />
              <span>Site map</span>
            </Link>
            {signedIn && (
              <button
                type="button"
                className={cx(popoverItemClassName, styles.logout)}
                onClick={() => {
                  close();
                  onLogout();
                }}
              >
                <LogOut size={18} aria-hidden="true" />
                <span>Log out</span>
              </button>
            )}
          </PopoverSection>
        </>
      )}
    </Popover>
  );
}
