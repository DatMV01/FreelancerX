import DashboardLayout from "@/components/layouts/DashboardLayout";
import BuyerAccountSettings from "@/features/dashboard/buyer/components/BuyerAccountSettings";
import { ReactElement } from "react";

function BuyerDashboardSettings() {
  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">BuyerDashboardSettings</h2>

      <BuyerAccountSettings />
    </div>
  );
}

BuyerDashboardSettings.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default BuyerDashboardSettings;
