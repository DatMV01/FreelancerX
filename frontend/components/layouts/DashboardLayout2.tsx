"use client";

import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NavbarLeftLoginDialog from "@/features/navbar/components/NavbarLeftLoginDialog";
import NavbarLeftPopover from "@/features/navbar/components/NavbarLeftPopover";
import UserAvatar from "@/features/user/components/UserAvatar";
import { selectUser } from "@/lib/redux/features/auth/authSlice";
import { useAppSelector } from "@/lib/redux/hooks";
import { route } from "@/lib/route";
import {
  AlignJustify,
  Heart,
  LifeBuoy,
  Package,
  Settings,
  ShoppingBag,
  User,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import Logo from "../LogoImage";

interface DashboardLayoutProps {
  children: ReactNode;
}

const buyerNavItems = [
  {
    label: "Orders",
    href: route.dashboard.orders,
    icon: ShoppingBag,
    roles: ["buyer"],
  },
  {
    label: "Favorites",
    href: route.dashboard.favorites,
    icon: Heart,
    roles: ["buyer"],
  },
];

const freelancerNavItems = [
  {
    label: "Profile",
    href: route.freelancer.profile,
    icon: User,
    roles: ["freelancer"],
  },
  {
    label: "Tasks",
    href: route.freelancer.tasks,
    icon: ShoppingBag,
    roles: ["freelancer"],
  },
  {
    label: "Gigs",
    href: route.freelancer.gigs,
    icon: Package,
    roles: ["freelancer"],
  },
];

const adminNavItems = [
  // {
  //   label: "Manage Users",
  //   href: route.admin.users,
  //   icon: Users,
  //   roles: ["admin"],
  // },

  {
    label: "Manage Orders",
    href: route.admin.orders,
    icon: ShoppingBag,
    roles: ["admin"],
  },
  {
    label: "Manage Gigs",
    href: route.admin.gigs,
    icon: Package,
    roles: ["admin"],
  },
  {
    label: "Manage Transactions",
    href: route.admin.transactions,
    icon: Wallet,
    roles: ["admin"],
  },
  // {
  //   label: "Manage Supports",
  //   href: route.admin.supports,
  //   icon: Wallet,
  //   roles: ["admin"],
  // },
  {
    label: "Settings",
    href: route.dashboard.settings,
    icon: Settings,
    roles: ["admin"],
  },
];

const generalNavItems = [
  {
    label: "Wallet",
    href: route.dashboard.wallet,
    icon: Wallet,
    roles: ["all"],
  },
  // {
  //   label: "Help",
  //   href: route.dashboard.help,
  //   icon: LifeBuoy,
  //   roles: ["all"],
  // },
  {
    label: "Settings",
    href: route.dashboard.settings,
    icon: Settings,
    roles: ["all"],
  },
];

export const navItems = [
  ...buyerNavItems,
  ...freelancerNavItems,
  ...adminNavItems,
  ...generalNavItems,
];

export const SidebarNav = ({
  onNavigate,
  userRole = "buyer",
}: {
  onNavigate?: () => void;
  userRole?: string;
}) => {
  const pathname = usePathname();

  return (
    <nav className="space-y-2">
      {navItems.map((item) => {
        if (!item.roles.includes(userRole)) return null;

        const isActive = pathname.includes(item.href);
        return (
          <Link key={item.href} href={item.href} onClick={onNavigate}>
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

const Menu = ({ onNavigate }: { onNavigate?: () => void }) => {
  const user = useAppSelector(selectUser);
  const fullName = user?.fullName || "Guest";
  const userRole = user?.role?.name.toUpperCase() ?? "BUYER";

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center gap-x-2">
        <UserAvatar height={50} width={50} />
        <div className="flex-1">
          <p className="text-xl font-bold text-gray-700">{fullName}</p>
          <span className="text-md text-gray-500">{user?.email}</span>
        </div>
      </div>

      {userRole !== "ADMIN" && (
        <div>
          <p className="border p-2 text-center font-bold">General Menu</p>
          <SidebarNav userRole="all" onNavigate={onNavigate} />
        </div>
      )}

      {userRole === "ADMIN" && (
        <div>
          <p className="border p-2 text-center font-bold">Admin Menu</p>
          <SidebarNav userRole="admin" onNavigate={onNavigate} />
        </div>
      )}

      {userRole !== "ADMIN" && (
        <div>
          <p className="border p-2 text-center font-bold">Buyer Menu</p>
          <SidebarNav userRole="buyer" onNavigate={onNavigate} />
        </div>
      )}

      {userRole === "FREELANCER" && (
        <div>
          <p className="border p-2 text-center font-bold">Freelancer Menu</p>
          <SidebarNav userRole="freelancer" onNavigate={onNavigate} />
        </div>
      )}
    </div>
  );
};

export default function DashboardLayout2({ children }: DashboardLayoutProps) {
  const user = useAppSelector(selectUser);

  const [sheetOpen, setSheetOpen] = useState(false);

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
              <Menu onNavigate={() => setSheetOpen(false)} />
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center space-x-2 font-bold">
            <Logo /> <span>FreelancerX</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {/* <Link
            href={route.public.home}
            className="py rounded-sm border border-black px-4 text-center font-bold hover:bg-gray-50 hover:text-green-500"
          >
            Switch to Buying
          </Link> */}

          {user ? <NavbarLeftPopover /> : <NavbarLeftLoginDialog />}
        </div>
      </header>

      {/* Body: Sidebar + Main */}
      <div className="flex flex-1">
        {/* Sidebar (desktop only) */}
        <aside className="hidden w-[300px] shrink-0 border-r bg-white p-4 xl:block">
          <Menu />
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
