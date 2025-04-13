import DashboardLayout from "@/components/layouts/DashboardLayout";
import { ReactElement } from "react";

function FreelancerDashboardGigs() {
  return (
    <h2 className="mb-4 text-xl font-bold">FreelancerDashboardGigs</h2>
  );
}

FreelancerDashboardGigs.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default FreelancerDashboardGigs;
