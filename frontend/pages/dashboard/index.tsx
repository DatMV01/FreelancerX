"use client";

import DashboardLayout2 from "@/components/layouts/DashboardLayout2";
import { DashboardMainContentHeader } from "@/features/dashboard/components/DashboardMainContent";
import { ReactElement } from "react";

function DashboardPage() {
  return (
    <DashboardMainContentHeader>
      <p>DashboardPage</p>
    </DashboardMainContentHeader>
  );
}

DashboardPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout2>{page}</DashboardLayout2>;
};

export default DashboardPage;
