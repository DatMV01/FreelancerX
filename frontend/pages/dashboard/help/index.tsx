import DashboardLayout2 from "@/components/layouts/DashboardLayout2";
import {
  DashboardMainContent,
  DashboardMainContentHeader,
} from "@/features/dashboard/components/DashboardMainContent";
import Help from "@/features/helpandsupport/components/Help";
import { ReactElement } from "react";

function HelpAndSupport() {
  return (
    <DashboardMainContent>
      <DashboardMainContentHeader>
        <p>Help</p>
      </DashboardMainContentHeader>

      <Help />
    </DashboardMainContent>
  );
}

HelpAndSupport.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout2>{page}</DashboardLayout2>;
};

export default HelpAndSupport;
