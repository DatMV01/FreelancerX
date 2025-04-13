import DashboardLayout from "@/components/layouts/DashboardLayout";
import { ReactElement } from "react";

function FreelancerDashboardEarnings() {
  return (
    <h2 className="mb-4 text-xl font-bold">FreelancerDashboardEarnings</h2>
  );
}

FreelancerDashboardEarnings.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default FreelancerDashboardEarnings;
