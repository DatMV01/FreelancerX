import DashboardLayout from "@/components/layouts/DashboardLayout";
import FreelancerSettings from "@/features/dashboard/freelancer/components/FreelancerSettings";
import { ReactElement } from "react";

function FreelancerDashboardSettings() {
  return (
    <div>
    
      <h2 className="mb-4 text-xl font-bold">FreelancerDashboardSettings</h2>
      <FreelancerSettings />
    </div>
  );
}

FreelancerDashboardSettings.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default FreelancerDashboardSettings;
