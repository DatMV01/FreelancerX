import DashboardLayout2 from "@/components/layouts/DashboardLayout2";
import UpdatePasswordForm from "@/features/auth/components/UpdatePasswordForm";
import {
  DashboardMainContent,
  DashboardMainContentHeader,
} from "@/features/dashboard/components/DashboardMainContent";
import { ReactElement } from "react";

function DashboardSettings() {
  return (
    <DashboardMainContent>
      <DashboardMainContentHeader>
        <p>Settings</p>
      </DashboardMainContentHeader>
      
      <UpdatePasswordForm />
    </DashboardMainContent>
  );
}

DashboardSettings.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout2>{page}</DashboardLayout2>;
};

export default DashboardSettings;
