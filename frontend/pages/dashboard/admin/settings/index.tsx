import DashboardLayout from "@/components/layouts/DashboardLayout";
import DashboardLayout2 from "@/components/layouts/DashboardLayout2";
import ChangePasswordForm from "@/features/auth/components/ChangePasswordForm";
import { ReactElement } from "react";

function AdminDashboardSettings() {
  return (
    <div className="flex flex-col space-y-6">
      <h1 className="rounded-md border border-green-500 p-4 text-center text-2xl font-bold text-green-500">
        Settings
      </h1>
      <ChangePasswordForm />
    </div>
  );
}

AdminDashboardSettings.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout2>{page}</DashboardLayout2>;
};

export default AdminDashboardSettings;
