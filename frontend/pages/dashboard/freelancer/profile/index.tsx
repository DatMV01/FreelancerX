import DashboardLayout from "@/components/layouts/DashboardLayout";
import DashboardLayout2 from "@/components/layouts/DashboardLayout2";
import FreelancerProfile from "@/features/dashboard/freelancer/components/FreelancerProfile";
import { ReactElement } from "react";

export default function FreelancerDashboardProfile() {
  return <FreelancerProfile />;
}

FreelancerDashboardProfile.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout2>{page}</DashboardLayout2>;
};
