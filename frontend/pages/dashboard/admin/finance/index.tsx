import DashboardLayout from "@/components/layouts/DashboardLayout";
import { ReactElement } from "react";

function AdminDashboardFinanceManagement() {
  return (
    <h2 className="mb-4 text-xl font-bold">AdminDashboardFinanceManagement</h2>
  );
}

AdminDashboardFinanceManagement.getLayout = function getLayout(
  page: ReactElement,
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default AdminDashboardFinanceManagement;
