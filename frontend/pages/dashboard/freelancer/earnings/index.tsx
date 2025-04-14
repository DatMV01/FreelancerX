import DashboardLayout from "@/components/layouts/DashboardLayout";
import FreelancerEarnings from "@/features/dashboard/freelancer/components/FreelancerEarnings";
import WithdrawSection from "@/features/dashboard/freelancer/components/WithdrawBalance";
import { ReactElement } from "react";

function FreelancerDashboardEarnings() {
  return (
    <div className="space-y-6 p-6">
      <h2 className="mb-4 text-xl font-bold">FreelancerDashboardEarnings</h2>
      <FreelancerEarnings />
      <WithdrawSection />
    </div>
  );
}

FreelancerDashboardEarnings.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default FreelancerDashboardEarnings;
