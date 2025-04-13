"use client";

import DashboardLayout, {
  navItems,
} from "@/components/layouts/DashboardLayout";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactElement, useEffect, useState } from "react";

export const SidebarNav = ({
  userRole,
  onNavigate,
}: {
  userRole: string;
  onNavigate?: () => void;
}) => {
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return (
    <nav className="space-y-2">
      {navItems.map((item) => {
        if (!item.roles.includes(userRole)) return null;

        const isActive = pathname === item.href;
        return (
          <Link key={item.href} href={item.href}>
            <div
              className={`flex items-center gap-3 rounded-lg p-3 transition-colors ${
                isActive
                  ? "bg-gray-200 font-semibold text-black"
                  : "text-gray-600 hover:bg-gray-100 hover:text-black"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
};

function DashboardPage() {
  const userRole = "admin";
  return (
    <>
      <SidebarNav userRole={"buyer"} />
      <SidebarNav userRole={"freelancer"} />
      <SidebarNav userRole={"admin"} />
    </>
  );
}

DashboardPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default DashboardPage;
