import DashboardLayout from "@/components/layouts/DashboardLayout";
import FreelancerEarnings from "@/features/dashboard/freelancer/components/FreelancerEarnings";
import FreelancerEarningsStats from "@/features/dashboard/freelancer/components/FreelancerEarningsStats";
import PaymentMethodForm from "@/features/dashboard/freelancer/components/PaymentMethodForm";
import WithdrawalHistoryLink from "@/features/dashboard/freelancer/components/WithdrawalHistoryLink";
import WithdrawSection from "@/features/dashboard/freelancer/components/WithdrawBalance";
import WithdrawSettings from "@/features/dashboard/freelancer/components/WithdrawSettings";
import { ReactElement } from "react";

function FreelancerDashboardEarnings() {
  return (
    <div className="space-y-6 p-6">
      <h2 className="mb-4 text-xl font-bold">FreelancerDashboardEarnings</h2>
      <FreelancerEarnings />
      <WithdrawSection />
      <PaymentMethodForm />
      <WithdrawSettings />
      <WithdrawalHistoryLink />
      <FreelancerEarningsStats />
    </div>
  );
}

FreelancerDashboardEarnings.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default FreelancerDashboardEarnings;
