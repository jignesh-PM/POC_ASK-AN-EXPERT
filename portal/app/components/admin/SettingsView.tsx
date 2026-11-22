"use client";

import { Field, Grid, Select, Stack, Switch } from "@/app/components/ui";
import { LANGUAGES, REGIONS } from "@/app/lib/locale";
import { mascotConfig } from "@/app/lib/mascot";
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
      <AdminPanel id="admin-portal-settings" title="Portal settings" saved={saved}>
        <Stack gap={4}>
          <Switch
            label="Customer sign-up"
            description="Let customers create their own accounts."
            checked={settings.signupEnabled}
            onChange={(event) => update({ signupEnabled: event.target.checked }, `Self-service registration ${event.target.checked ? "enabled" : "disabled"}`)}
          />
          <Switch
            label="Require a complete profile"
            description="Needed before expert chat and restricted tools."
            checked={settings.requireProfile}
            onChange={(event) => update({ requireProfile: event.target.checked }, `Profile requirement ${event.target.checked ? "enabled" : "disabled"}`)}
          />
          <Switch
            label={`Show portal guide (${mascotConfig.name})`}
            description="The mascot on the home page, empty states and Morgan AI answers."
            checked={settings.mascotEnabled}
            onChange={(event) => update({ mascotEnabled: event.target.checked }, `Portal guide ${event.target.checked ? "shown" : "hidden"}`)}
          />
          <Grid min={240} gap={4}>
            <Field label="Default region" hint="For new visitors.">
              <Select value={settings.defaultRegion} onChange={(event) => update({ defaultRegion: event.target.value }, `Default region set to ${event.target.value}`)}>
                {REGIONS.map((region) => (
                  <option key={region.value} value={region.value}>
                    {region.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Default language" hint="For new visitors.">
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

      <AdminPanel id="admin-audit-log" title="Audit log" description="Latest 100 admin changes.">
        <AuditList events={audit} />
      </AdminPanel>
    </>
  );
}
