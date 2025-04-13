import DashboardLayout from "@/components/layouts/DashboardLayout";
import { ReactElement } from "react";

export default function BuyerDashboardProfile() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">BuyerDashboardProfile</h1>
    </div>
  );
}

BuyerDashboardProfile.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
