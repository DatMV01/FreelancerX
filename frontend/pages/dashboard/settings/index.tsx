import DashboardLayout2 from "@/components/layouts/DashboardLayout2";
import ChangePasswordForm from "@/features/auth/components/ChangePasswordForm";
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
      
      <ChangePasswordForm />
    </DashboardMainContent>
  );
}

DashboardSettings.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout2>{page}</DashboardLayout2>;
};

export default DashboardSettings;
