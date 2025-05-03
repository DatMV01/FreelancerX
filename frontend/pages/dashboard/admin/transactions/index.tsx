import DashboardLayout2 from "@/components/layouts/DashboardLayout2";
import { ReactElement } from "react";

export default function AdminDashboardManageTransactions() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">AdminDashboardManageTransactions</h1>
    </div>
  );
}

AdminDashboardManageTransactions.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout2>{page}</DashboardLayout2>;
};
