import DashboardLayout from "@/components/layouts/DashboardLayout";
import { ReactElement } from "react";

export default function BuyerDashboardHome() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Buyer DashboardHome</h1>
    </div>
  );
}

BuyerDashboardHome.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
