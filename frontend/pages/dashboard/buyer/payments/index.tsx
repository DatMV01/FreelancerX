import DashboardLayout from "@/components/layouts/DashboardLayout";
import { ReactElement } from "react";

function BuyerDashboardGigs() {
  return <h2 className="mb-4 text-xl font-bold">BuyerDashboardGigs</h2>;
}

BuyerDashboardGigs.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default BuyerDashboardGigs;
