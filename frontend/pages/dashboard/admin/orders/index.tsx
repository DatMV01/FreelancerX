import DashboardLayout from "@/components/layouts/DashboardLayout";
import { ReactElement } from "react";

function AdminDashboardOrders() {
  return <h2 className="mb-4 text-xl font-bold">AdminDashboardOrders</h2>;
}

AdminDashboardOrders.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default AdminDashboardOrders;
