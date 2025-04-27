import DashboardLayout from "@/components/layouts/DashboardLayout";
import UpdatePasswordForm from "@/features/auth/components/UpdatePasswordForm";
import FreelancerSettings from "@/features/dashboard/freelancer/components/FreelancerSettings";
import { ReactElement } from "react";

function FreelancerDashboardSettings() {
  return (
    <div className="flex flex-col space-y-6">
      <h1 className="rounded-md border border-green-500 p-4 text-center text-2xl font-bold text-green-500">
        Settings
      </h1>
      <UpdatePasswordForm />
    </div>
  );
}

FreelancerDashboardSettings.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default FreelancerDashboardSettings;
