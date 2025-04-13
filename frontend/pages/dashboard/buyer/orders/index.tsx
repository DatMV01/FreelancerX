import DashboardLayout from "@/components/layouts/DashboardLayout";
import { ReactElement } from "react";


function BuyerOrderPage() {
  return <h2 className="mb-4 text-xl font-bold">BuyerOrderPage</h2>;
}

BuyerOrderPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default BuyerOrderPage;
