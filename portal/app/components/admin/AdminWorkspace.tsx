"use client";

import Link from "next/link";
import type { ComponentType } from "react";
import { Activity, Boxes, FileText, Grid2X2, Settings, Shield, Users, type IconProps } from "@/app/components/Icon";
import { Button, Card, EmptyState } from "@/app/components/ui";
import { useRole } from "@/app/lib/session";
import { useHydrated } from "@/app/lib/storage";
import { AnalyticsView } from "./AnalyticsView";
import { ContentView } from "./ContentView";
import { ExpertTeamsView } from "./ExpertTeamsView";
import { OverviewView } from "./OverviewView";
import { SettingsView } from "./SettingsView";
import { UsersView } from "./UsersView";
import { ADMIN_VIEWS, adminViewHref, type AdminView } from "./views";
import styles from "./AdminWorkspace.module.css";

const VIEW_ICONS: Record<AdminView, ComponentType<IconProps>> = {
  overview: Grid2X2,
  users: Users,
  experts: Boxes,
  content: FileText,
  analytics: Activity,
  settings: Settings,
};

const VIEW_COMPONENTS: Record<AdminView, ComponentType> = {
  overview: OverviewView,
  users: UsersView,
  experts: ExpertTeamsView,
  content: ContentView,
  analytics: AnalyticsView,
  settings: SettingsView,
};

/** Super Admin workspace: role gate, section navigation and the active view. */
export default function AdminWorkspace({ view }: { view: AdminView }) {
  const hydrated = useHydrated();
  const role = useRole();

  if (!hydrated) {
    return (
      <Card padding="lg" className={styles.loading}>
        <p role="status">Loading admin workspace…</p>
      </Card>
    );
  }

  if (role !== "Super Admin") {
    return (
      <EmptyState
        icon={<Shield size={22} />}
        title="Super Admin access required"
        description="Use the account menu to select the Super Admin preview, then return to this page."
        action={
          <Button href="/" variant="secondary">
            Return to home
          </Button>
        }
      />
    );
  }

  const ActiveView = VIEW_COMPONENTS[view];

  return (
    <div className={styles.layout}>
      <nav className={styles.sidebar} aria-label="Admin sections">
        <p className={styles.sidebarTitle} aria-hidden="true">
          Administration
        </p>
        <ul className={styles.navList}>
          {ADMIN_VIEWS.map((item) => {
            const Icon = VIEW_ICONS[item.id];
            return (
              <li key={item.id}>
                <Link className={styles.navLink} href={adminViewHref(item.id)} aria-current={item.id === view ? "page" : undefined} scroll={false}>
                  <Icon size={18} aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className={styles.main}>
        <ActiveView />
      </div>
    </div>
  );
}
