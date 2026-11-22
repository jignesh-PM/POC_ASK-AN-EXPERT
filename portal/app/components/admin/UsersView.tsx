"use client";

import { useState, type FormEvent } from "react";
import { FileUp, Plus, Users } from "@/app/components/Icon";
import { Alert, Badge, Button, Checkbox, EmptyState, Field, Grid, Input, Select, Textarea } from "@/app/components/ui";
import { categories } from "@/app/lib/mock-data";
import { createId } from "@/app/lib/storage";
import { AdminPanel } from "./AdminPanel";
import { AdminTable, CellNote } from "./AdminTable";
import { MANAGED_ROLES, isManagedRole, useAdminUsers, writeAdminUsers, type AdminUser, type ManagedRole } from "./admin-store";
import { useSavedFlash } from "./useSavedFlash";
import styles from "./UsersView.module.css";

const EMPTY_DRAFT = { name: "", email: "", company: "", country: "", role: "Customer" as ManagedRole };
const CSV_PLACEHOLDER = "name,email,company,country,role\nAlex Morgan,alex@example.com,Acme,United Kingdom,Customer";

function newAccount(fields: Pick<AdminUser, "name" | "email" | "company" | "country" | "role">): AdminUser {
  return { ...fields, id: createId("user"), productLines: [], active: true, createdAt: new Date().toISOString() };
}

/** Parses `name,email,company,country,role` rows; a header row is skipped. */
function parseCsv(text: string): AdminUser[] {
  const rows = text
    .split(/\r?\n/)
    .map((row) => row.split(",").map((cell) => cell.trim().replace(/^"|"$/g, "")))
    .filter((row) => row.length >= 2 && row.some(Boolean));
  const start = rows[0]?.[0]?.toLowerCase().includes("name") ? 1 : 0;
  return rows
    .slice(start)
    .filter(([name, email]) => name && email)
    .map(([name, email, company = "", country = "", role]) => newAccount({ name, email, company, country, role: isManagedRole(role) && role !== "Customer" ? role : "Customer" }));
}

export function UsersView() {
  const users = useAdminUsers();
  const { saved, record } = useSavedFlash();
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [createError, setCreateError] = useState("");
  const [csvText, setCsvText] = useState("");
  const [csvError, setCsvError] = useState("");

  const emailTaken = (email: string) => users.some((user) => user.email.toLowerCase() === email.trim().toLowerCase());

  const save = (next: AdminUser[], detail: string) => {
    writeAdminUsers(next);
    record("Users updated", detail);
  };

  const createUser = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = draft.name.trim();
    const email = draft.email.trim();
    if (!name || !email) return setCreateError("Name and email are required.");
    if (emailTaken(email)) return setCreateError("An account already uses that email address.");
    save([newAccount({ ...draft, name, email, company: draft.company.trim(), country: draft.country.trim() }), ...users], `Created ${name} (${draft.role})`);
    setDraft(EMPTY_DRAFT);
    setCreateError("");
  };

  const importCsv = () => {
    const accounts = parseCsv(csvText).filter((candidate) => !emailTaken(candidate.email));
    if (!accounts.length) return setCsvError("No new accounts were found. Use name,email,company,country,role columns.");
    save([...accounts, ...users], `Imported ${accounts.length} account${accounts.length === 1 ? "" : "s"} from CSV`);
    setCsvText("");
    setCsvError("");
  };

  const updateUser = (user: AdminUser, update: Partial<AdminUser>, detail: string) => save(users.map((item) => (item.id === user.id ? { ...item, ...update } : item)), detail);

  const toggleProductLine = (user: AdminUser, slug: string) =>
    updateUser(user, { productLines: user.productLines.includes(slug) ? user.productLines.filter((item) => item !== slug) : [...user.productLines, slug] }, `Product lines for ${user.name}`);

  return (
    <>
      <AdminPanel id="admin-create-user" title="Create an account" description="Issue an alpha ID for a customer or Morgan colleague." saved={saved}>
        <form className={styles.form} onSubmit={createUser} noValidate>
          <Grid min={220} gap={4}>
            <Field label="Full name">
              <Input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} autoComplete="off" required />
            </Field>
            <Field label="Email address">
              <Input type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} placeholder="name@company.com" autoComplete="off" required />
            </Field>
            <Field label="Company" optional>
              <Input value={draft.company} onChange={(event) => setDraft({ ...draft, company: event.target.value })} />
            </Field>
            <Field label="Country" optional>
              <Input value={draft.country} onChange={(event) => setDraft({ ...draft, country: event.target.value })} />
            </Field>
            <Field label="Role">
              <Select value={draft.role} onChange={(event) => setDraft({ ...draft, role: event.target.value as ManagedRole })}>
                {MANAGED_ROLES.map((role) => (
                  <option key={role}>{role}</option>
                ))}
              </Select>
            </Field>
          </Grid>
          {createError && <Alert tone="danger">{createError}</Alert>}
          <div className={styles.actions}>
            <Button type="submit" leading={<Plus size={16} aria-hidden="true" />}>
              Create account
            </Button>
          </div>
        </form>
      </AdminPanel>

      <AdminPanel id="admin-import-users" title="Import alpha users from CSV" description="Paste one account per line. Columns: name, email, company, country, role. Existing emails are skipped.">
        <Field label="CSV rows">
          <Textarea value={csvText} onChange={(event) => setCsvText(event.target.value)} rows={4} placeholder={CSV_PLACEHOLDER} spellCheck={false} />
        </Field>
        {csvError && <Alert tone="danger">{csvError}</Alert>}
        <div className={styles.actions}>
          <Button variant="secondary" onClick={importCsv} disabled={!csvText.trim()} leading={<FileUp size={16} aria-hidden="true" />}>
            Import accounts
          </Button>
        </div>
      </AdminPanel>

      <AdminPanel id="admin-user-list" title="Managed accounts" description="Change roles, assign Morgan User product lines and deactivate access." actions={<Badge tone="brand">{users.length} accounts</Badge>}>
        {users.length ? (
          <AdminTable caption="Managed accounts">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email / company</th>
                <th scope="col">Role</th>
                <th scope="col">Product line access</th>
                <th scope="col">Status</th>
                <th scope="col">
                  <span className="visually-hidden">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <th scope="row" className={styles.nameCell}>
                    {user.name}
                    <CellNote>{user.country || "Country not set"}</CellNote>
                  </th>
                  <td>
                    {user.email}
                    <CellNote>{user.company || "No company"}</CellNote>
                  </td>
                  <td className={styles.roleCell}>
                    <Field label={`Role for ${user.name}`} hideLabel>
                      <Select value={user.role} onChange={(event) => updateUser(user, { role: event.target.value as ManagedRole }, `${user.name} is now ${event.target.value}`)}>
                        {MANAGED_ROLES.map((role) => (
                          <option key={role}>{role}</option>
                        ))}
                      </Select>
                    </Field>
                  </td>
                  <td>
                    {user.role === "Morgan User" ? (
                      <fieldset className={styles.productLines}>
                        <legend className="visually-hidden">Product lines for {user.name}</legend>
                        {categories.map((category) => (
                          <Checkbox key={category.slug} label={category.name} checked={user.productLines.includes(category.slug)} onChange={() => toggleProductLine(user, category.slug)} />
                        ))}
                      </fieldset>
                    ) : (
                      <CellNote>Not applicable</CellNote>
                    )}
                  </td>
                  <td>
                    <Badge tone={user.active ? "success" : "danger"}>{user.active ? "Active" : "Deactivated"}</Badge>
                  </td>
                  <td>
                    <Button
                      size="sm"
                      variant={user.active ? "secondary" : "primary"}
                      onClick={() => updateUser(user, { active: !user.active }, `${user.active ? "Deactivated" : "Reactivated"} ${user.name}`)}
                      aria-label={`${user.active ? "Deactivate" : "Reactivate"} ${user.name}`}
                    >
                      {user.active ? "Deactivate" : "Reactivate"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </AdminTable>
        ) : (
          <EmptyState icon={<Users size={22} />} title="No managed accounts yet" description="Create an alpha ID above or import a CSV." />
        )}
      </AdminPanel>
    </>
  );
}
