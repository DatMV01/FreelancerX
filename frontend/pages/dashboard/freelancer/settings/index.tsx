import DashboardLayout from "@/components/layouts/DashboardLayout";
import { ReactElement } from "react";

function FreelancerDashboardSettings() {
  return (
    <h2 className="mb-4 text-xl font-bold">FreelancerDashboardSettings</h2>
  );
}

FreelancerDashboardSettings.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default FreelancerDashboardSettings;
