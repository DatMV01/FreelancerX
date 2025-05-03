import DashboardLayout2 from "@/components/layouts/DashboardLayout2";
import { ReactElement } from "react";

export default function AdminDashboardManageGigs() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">AdminDashboardManageGigs</h1>
    </div>
  );
}

AdminDashboardManageGigs.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout2>{page}</DashboardLayout2>;
};
