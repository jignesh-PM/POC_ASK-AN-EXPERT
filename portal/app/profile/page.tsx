import { Page, PageHeader } from "@/app/components/ui";
import DataConsentCard from "@/app/components/account/DataConsentCard";
import MyQuestionsCard from "@/app/components/account/MyQuestionsCard";
import PasswordSettings from "@/app/components/account/PasswordSettings";
import ProfileForm from "@/app/components/account/ProfileForm";
import styles from "@/app/components/account/Account.module.css";

export const metadata = { title: "Your profile" };

export default function ProfilePage() {
  return (
    <Page>
      <PageHeader title="Your profile" description="Keep your contact and organization details up to date for more relevant support." />
      <div className={styles.profileLayout}>
        <ProfileForm />
        <div className={styles.sideColumn}>
          <MyQuestionsCard />
          <PasswordSettings />
          <DataConsentCard />
        </div>
      </div>
    </Page>
  );
}
