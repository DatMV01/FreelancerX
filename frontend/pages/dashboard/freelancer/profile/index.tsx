import DashboardLayout from "@/components/layouts/DashboardLayout";
import FreelancerProfile from "@/features/dashboard/freelancer/components/FreelancerProfile";
import { ReactElement } from "react";

export default function FreelancerDashboardProfile() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">FreelancerDashboardProfile</h1>

      <FreelancerProfile />
    </div>
  );
}

FreelancerDashboardProfile.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
