"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, ChevronRight, Eye, FileText, KeyRound, LogIn, LogOut, Mail, MessageSquareText, Moon, Phone, Sparkles, Sun, UserRound, ExternalLink, Compass } from "../Icon";
import { Button, Field, Popover, PopoverHeader, PopoverSection, Select, Switch, cx, popoverItemClassName } from "../ui";
import { setTheme, useTheme } from "../../lib/theme";
import { ROLES, ROLE_LABELS, isRole, roleHome, setLanguage, setRegion, setRole, useLanguage, useRegion, useRole, type Role } from "../../lib/session";
import { useProfileCompletion } from "../../lib/profile-completion";
import { STORAGE_KEYS, useStoredString, writeString } from "../../lib/storage";
import { LANGUAGES, REGIONS } from "../../lib/locale";
import AskExpertButton from "./AskExpertButton";
import styles from "./Shell.module.css";

/** Main header row: brand, then preview role, utilities and the animated Ask an Expert badge. */
export default function TopBar() {
  const router = useRouter();
  const role = useRole();

  const switchRole = (next: Role) => {
    setRole(next);
    router.push(roleHome(next));
  };

  return (
    <div className={styles.topBar}>
      <Link href="/" className={styles.brand} aria-label="Morgan home">
        {/* Black logo on the light header, white logo in dark mode (switched in CSS). */}
        <Image src="/morgan-logo-black.png" alt="Morgan Advanced Materials" width={531} height={155} priority className={cx(styles.logo, styles.logoLight)} />
        <Image src="/morgan-logo.png" alt="" width={1149} height={336} priority className={cx(styles.logo, styles.logoDark)} />
      </Link>

      <div className={styles.actions}>
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
        <AskExpertButton />
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
                <strong>Welcome to Morgan</strong>
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
  const theme = useTheme();
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
            <div className={styles.themeRow}>
              {theme === "dark" ? <Moon size={18} aria-hidden="true" /> : <Sun size={18} aria-hidden="true" />}
              <Switch
                className={styles.themeSwitch}
                label="Dark appearance"
                description={theme === "dark" ? "Dark theme is on" : "Light theme is on"}
                checked={theme === "dark"}
                onChange={(event) => setTheme(event.target.checked ? "dark" : "light")}
              />
            </div>
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
                <Link className={popoverItemClassName} href="/profile/questions" onClick={close}>
                  <MessageSquareText size={18} aria-hidden="true" />
                  <span>My questions</span>
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
