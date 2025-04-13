import DashboardLayout from "@/components/layouts/DashboardLayout";
import { ReactElement } from "react";


function FreelancerOrderPage() {
  return <h2 className="mb-4 text-xl font-bold">FreelancerOrderPageg</h2>;
}

FreelancerOrderPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default FreelancerOrderPage;
