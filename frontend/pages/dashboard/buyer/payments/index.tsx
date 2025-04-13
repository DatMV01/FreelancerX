import DashboardLayout from "@/components/layouts/DashboardLayout";
import BuyerPayments from "@/features/dashboard/buyer/components/BuyerPayments";
import { ReactElement } from "react";

function BuyerDashboardGigs() {
  return <BuyerPayments />
}

BuyerDashboardGigs.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default BuyerDashboardGigs;
