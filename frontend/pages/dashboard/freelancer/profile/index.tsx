import DashboardLayout from "@/components/layouts/DashboardLayout";
import FreelancerProfile from "@/features/dashboard/freelancer/components/FreelancerProfile";
import { ReactElement } from "react";

export default function FreelancerDashboardProfile() {
  return (
    <div  >
 
      <FreelancerProfile />
    </div>
  );
}

FreelancerDashboardProfile.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
