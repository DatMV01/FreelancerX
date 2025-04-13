"use client";

import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NavbarLeftLoginDialog from "@/features/navbar/components/NavbarLeftLoginDialog";
import NavbarLeftPopoverMessages from "@/features/navbar/components/NavbarLeftPopoverMessages";
import NavbarLeftPopoverNotifications from "@/features/navbar/components/NavbarLeftPopoverNotifications";
import NavbarLeftPopoverOrder from "@/features/navbar/components/NavbarLeftPopoverOrder";
import UserAvatar from "@/features/user/components/UserAvatar";
import { selectUser } from "@/lib/redux/features/auth/authSlice";
import { useAppSelector } from "@/lib/redux/hooks";
import { route } from "@/lib/route";
import { motion } from "framer-motion";
import {
  AlignJustify,
  Badge,
  CreditCard,
  DollarSign,
  FileBarChart,
  Folder,
  Heart,
  Home,
  LifeBuoy,
  MessageSquare,
  Package,
  Search,
  Settings,
  User,
  Users,
  UserSearch,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import Logo from "../LogoImage";
import { Badge as BadgeMUI } from "@mui/material";
import NavbarLeftPopoverAvatar from "@/features/navbar/components/NavbarLeftPopoverAvatar";

interface DashboardLayoutProps {
  children: ReactNode;
}

const sharedNavItems = [
  {
    label: "Home",
    href: "/dashboard",
    icon: Home,
    roles: ["buyer", "freelancer", "admin"],
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: User,
    roles: ["buyer", "freelancer", "admin"],
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["buyer", "freelancer", "admin"],
  },
];

const buyerNavItems = [
  {
    label: "Orders",
    href: "/dashboard/buyer/orders",
    icon: Package,
    roles: ["buyer"],
  },
  {
    label: "Favorites",
    href: "/dashboard/buyer/favorites",
    icon: Heart,
    roles: ["buyer"],
  },
  {
    label: "Browse Freelancers",
    href: "/dashboard/freelancers",
    icon: UserSearch,
    roles: ["buyer"],
  },
  {
    label: "Payments",
    href: "/dashboard/payments",
    icon: CreditCard,
    roles: ["buyer"],
  },
  {
    label: "Help",
    href: "/dashboard/help",
    icon: LifeBuoy,
    roles: ["buyer"],
  },
];

const freelancerNavItems = [
  {
    label: "Projects",
    href: "/dashboard/projects",
    icon: Package,
    roles: ["freelancer"],
  },
  {
    label: "Find Work",
    href: "/dashboard/find-work",
    icon: Search,
    roles: ["freelancer"],
  },
  {
    label: "Earnings",
    href: "/dashboard/earnings",
    icon: Wallet,
    roles: ["freelancer"],
  },
  {
    label: "Portfolio",
    href: "/dashboard/portfolio",
    icon: Folder,
    roles: ["freelancer"],
  },
  {
    label: "Help",
    href: "/dashboard/help",
    icon: LifeBuoy,
    roles: ["freelancer"],
  },
];

const adminNavItems = [
  {
    label: "Manage Users",
    href: "/dashboard/admin/users",
    icon: Users,
    roles: ["admin"],
  },
  {
    label: "Orders Report",
    href: "/dashboard/admin/orders",
    icon: FileBarChart,
    roles: ["admin"],
  },
  {
    label: "Revenue",
    href: "/dashboard/admin/revenue",
    icon: DollarSign,
    roles: ["admin"],
  },
  {
    label: "Admin Settings",
    href: "/dashboard/admin/settings",
    icon: Settings,
    roles: ["admin"],
  },
  {
    label: "Feedback",
    href: "/dashboard/admin/feedback",
    icon: MessageSquare,
    roles: ["admin"],
  },
  {
    label: "Help",
    href: "/dashboard/admin/help",
    icon: LifeBuoy,
    roles: ["admin"],
  },
];

export const navItems = [
  ...sharedNavItems,
  ...buyerNavItems,
  ...freelancerNavItems,
  ...adminNavItems,
];

export const SidebarNav = ({
  userRole,
  onNavigate,
}: {
  userRole: string;
  onNavigate?: () => void;
}) => {
  const pathname = usePathname();

  return (
    <nav className="space-y-2">
      {navItems.map((item) => {
        if (!item.roles.includes(userRole)) return null;

        const isActive = pathname === item.href;
        return (
          <Link key={item.href} href={item.href}>
            <div
              onClick={onNavigate}
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

const renderUserPopovers = () => (
  <>
    <NavbarLeftPopoverMessages />
    <NavbarLeftPopoverNotifications />
    <NavbarLeftPopoverOrder />
    <Link href={route.buyer.favorites}>
      <BadgeMUI
        color="success"
        sx={{
          "& .MuiBadge-badge": {
            fontSize: "11px",
            height: "21px",
            minWidth: "21px",
            padding: "0px",
          },
          "&": {
            borderRadius: "100%",
          },
          "&:hover": {
            backgroundColor: "#F3F4F6",
          },
        }}
      >
        <Heart />
      </BadgeMUI>
    </Link>
    <NavbarLeftPopoverAvatar />
  </>
);

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = useAppSelector(selectUser);

  const [sheetOpen, setSheetOpen] = useState(false);
  const userRole = "admin";

  return (
    <div className="bg-muted/40 mx-auto flex min-h-screen max-w-[1400px] flex-col">
      {/* Header / Topbar */}
      <header className="flex h-16 items-center justify-between border-b bg-white px-4">
        {/* Left: Mobile Menu Button + Logo */}
        <div className="flex items-center gap-2">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <AlignJustify className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-4">
              <SidebarNav
                userRole={userRole}
                onNavigate={() => setSheetOpen(false)}
              />
            </SheetContent>
          </Sheet>
          <div className="flex items-center space-x-2 font-bold">
            <Logo /> <span>FreelancerX Dashboard</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            href={route.public.home}
            className="py rounded-sm border border-black px-4 text-center font-bold hover:bg-gray-50 hover:text-green-500"
          >
            Switch to Buying
          </Link>

          {user ? renderUserPopovers() : <NavbarLeftLoginDialog />}
        </div>
      </header>

      {/* Body: Sidebar + Main */}
      <div className="flex flex-1">
        {/* Sidebar (desktop only) */}
        <aside className="hidden w-[250px] shrink-0 border-r bg-white p-4 md:block">
          <SidebarNav userRole={userRole} />
        </aside>

        {/* Main Content */}
        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="px-6 pt-4">
            <Breadcrumbs homePageHref="/dashboard" />
          </div>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
