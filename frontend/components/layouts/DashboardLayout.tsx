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
import {
  selectFreelancer,
  selectUser,
} from "@/lib/redux/features/auth/authSlice";
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
  ShoppingBag,
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
import NavbarLeftPopover from "@/features/navbar/components/NavbarLeftPopover";

interface DashboardLayoutProps {
  children: ReactNode;
}

const buyerNavItems = [
  {
    label: "Home",
    href: route.buyer.dashboard,
    icon: Home,
    roles: ["buyer"],
  },
  {
    label: "Profile",
    href: route.buyer.profile,
    icon: User,
    roles: ["buyer"],
  },
  {
    label: "Orders",
    href: route.buyer.orders,
    icon: ShoppingBag,
    roles: ["buyer"],
  },
  {
    label: "Payments",
    href: route.buyer.payments,
    icon: CreditCard,
    roles: ["buyer"],
  },
  {
    label: "Favorites",
    href: route.buyer.favorites,
    icon: Heart,
    roles: ["buyer"],
  },

  {
    label: "Settings",
    href: route.buyer.settings,
    icon: Settings,
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
    label: "Home",
    href: route.freelancer.dashboard,
    icon: Home,
    roles: ["freelancer"],
  },
  {
    label: "Profile",
    href: route.freelancer.profile,
    icon: User,
    roles: ["freelancer"],
  },
  {
    label: "Orders",
    href: route.freelancer.orders,
    icon: ShoppingBag,
    roles: ["freelancer"],
  },
  {
    label: "Payments",
    href: route.freelancer.payments,
    icon: CreditCard,
    roles: ["freelancer"],
  },
  {
    label: "Gigs",
    href: route.freelancer.gigs,
    icon: Package,
    roles: ["freelancer"],
  },

  {
    label: "Earnings",
    href: route.freelancer.earnings,
    icon: Wallet,
    roles: ["freelancer"],
  },
  {
    label: "Settings",
    href: route.freelancer.settings,
    icon: Settings,
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
    label: "Home",
    href: route.admin.dashboard,
    icon: Home,
    roles: ["admin"],
  },
  {
    label: "Manage Users",
    href: route.admin.users,
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
    label: "Finance",
    href: route.admin.finance,
    icon: DollarSign,
    roles: ["admin"],
  },
  {
    label: "System Settings",
    href: route.admin.settings,
    icon: Settings,
    roles: ["admin"],
  },

  {
    label: "Supports",
    href: route.admin.supports,
    icon: LifeBuoy,
    roles: ["admin"],
  },
];

export const navItems = [
  ...buyerNavItems,
  ...freelancerNavItems,
  ...adminNavItems,
];

export const SidebarNav = ({ onNavigate }: { onNavigate?: () => void }) => {
  const pathname = usePathname();
  let userRole = "buyer";
  if (pathname.includes("freelancer")) userRole = "freelancer";
  if (pathname.includes("admin")) userRole = "admin";

  return (
    <nav className="space-y-2">
      {navItems.map((item) => {
        if (!item.roles.includes(userRole)) return null;

        const isActive = pathname.includes(item.href);
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
  const freelancer = useAppSelector(selectFreelancer);

  const fullName = user?.fullName || "Guest";
  const [sheetOpen, setSheetOpen] = useState(false);
  const userRole = user?.role?.name.toLocaleLowerCase() ?? "buyer";

  const pathname = usePathname();

  return (
    <div className="bg-muted/40 mx-auto flex min-h-screen max-w-screen flex-col">
      {/* Header / Topbar */}
      <header className="flex h-16 items-center justify-between border-b bg-white px-4">
        {/* Left: Mobile Menu Button + Logo */}
        <div className="flex items-center gap-2">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="xl:hidden">
                <AlignJustify className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-4">
              <SidebarNav onNavigate={() => setSheetOpen(false)} />
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center space-x-2 font-bold">
            <Logo /> <span>FreelancerX</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            href={route.public.home}
            className="py rounded-sm border border-black px-4 text-center font-bold hover:bg-gray-50 hover:text-green-500"
          >
            Switch to Buying
          </Link>

          {user ? <NavbarLeftPopover /> : <NavbarLeftLoginDialog />}
        </div>
      </header>

      {/* Body: Sidebar + Main */}
      <div className="flex flex-1">
        {/* Sidebar (desktop only) */}
        <aside className="hidden w-[300px] shrink-0 border-r bg-white p-4 xl:block">
          <div className="rounded-lg border p-3 text-center font-bold">
            {pathname.includes("buyer") && "Buyer Dashboard"}
            {pathname.includes("freelancer") && "Freelancer Dashboard"}
            {pathname.includes("admin") && "Admin Dashboard"}
          </div>

          <div className="my-2 flex items-center space-x-2">
            <UserAvatar height={50} width={50} />
            <div className="flex-1">
              <p className="text-xl font-bold text-gray-700">{fullName}</p>
              <span className="text-md text-gray-500">{user?.email}</span>
            </div>
          </div>

          <SidebarNav />
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
