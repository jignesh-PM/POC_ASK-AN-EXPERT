"use client";

import { Field, Grid, Select, Stack, Switch } from "@/app/components/ui";
import { LANGUAGES, REGIONS } from "@/app/lib/locale";
import { useAdminSettings, useAuditLog, type AdminSettings } from "@/app/lib/session";
import { STORAGE_KEYS, writeJSON } from "@/app/lib/storage";
import { AdminPanel } from "./AdminPanel";
import { AuditList } from "./AuditList";
import { useSavedFlash } from "./useSavedFlash";

export function SettingsView() {
  const settings = useAdminSettings();
  const audit = useAuditLog();
  const { saved, record } = useSavedFlash();

  const update = (change: Partial<AdminSettings>, detail: string) => {
    writeJSON(STORAGE_KEYS.adminSettings, { ...settings, ...change });
    record("Portal settings updated", detail);
  };

  return (
    <>
      <AdminPanel id="admin-portal-settings" title="Portal settings" description="Configure registration, completion requirements and default locale." saved={saved}>
        <Stack gap={4}>
          <Switch
            label="Self-service customer registration"
            description="Allow customer and visitor accounts to sign up."
            checked={settings.signupEnabled}
            onChange={(event) => update({ signupEnabled: event.target.checked }, `Self-service registration ${event.target.checked ? "enabled" : "disabled"}`)}
          />
          <Switch
            label="Require a profile before expert chat and restricted tools"
            description="Prompt users to complete their profile before using gated features."
            checked={settings.requireProfile}
            onChange={(event) => update({ requireProfile: event.target.checked }, `Profile requirement ${event.target.checked ? "enabled" : "disabled"}`)}
          />
          <Grid min={240} gap={4}>
            <Field label="Default region" hint="Initial region for new portal sessions.">
              <Select value={settings.defaultRegion} onChange={(event) => update({ defaultRegion: event.target.value }, `Default region set to ${event.target.value}`)}>
                {REGIONS.map((region) => (
                  <option key={region.value} value={region.value}>
                    {region.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Default language" hint="Initial language for new portal sessions.">
              <Select value={settings.defaultLanguage} onChange={(event) => update({ defaultLanguage: event.target.value }, `Default language set to ${event.target.value}`)}>
                {LANGUAGES.map((language) => (
                  <option key={language.value} value={language.value}>
                    {language.label}
                  </option>
                ))}
              </Select>
            </Field>
          </Grid>
        </Stack>
      </AdminPanel>

      <AdminPanel id="admin-audit-log" title="Audit log" description="Recent Super Admin changes recorded in this browser (latest 100).">
        <AuditList events={audit} />
      </AdminPanel>
    </>
  );
}
