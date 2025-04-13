import DashboardLayout from "@/components/layouts/DashboardLayout";
import { ReactElement } from "react";

function AdminDashboardSettings() {
  return <h2 className="mb-4 text-xl font-bold">AdminDashboardSettings</h2>;
}

AdminDashboardSettings.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default AdminDashboardSettings;
