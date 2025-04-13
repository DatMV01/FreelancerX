"use client";

import Logo from "@/components/LogoImage";

import NavbarLeft from "@/features/navbar/components/NavbarLeft";
import NavbarLeftLoginDialog from "@/features/navbar/components/NavbarLeftLoginDialog";
import NavbarLeftPopoverAvatar from "@/features/navbar/components/NavbarLeftPopoverAvatar";
import NavbarLeftPopoverFavorites from "@/features/navbar/components/NavbarLeftPopoverFavorites";
import NavbarLeftPopoverMessages from "@/features/navbar/components/NavbarLeftPopoverMessages";
import NavbarLeftPopoverNotifications from "@/features/navbar/components/NavbarLeftPopoverNotifications";
import NavbarLeftPopoverOrder from "@/features/navbar/components/NavbarLeftPopoverOrder";
import NavbarMainCategoryMenu from "@/features/navbar/components/NavbarMainCategoryMenu";
import NavbarSearchBar from "@/features/navbar/components/NavbarSearchBar";

import { selectUser } from "@/lib/redux/features/auth/authSlice";
import { useAppSelector } from "@/lib/redux/hooks";
import { route } from "@/lib/route";
import { Badge } from "@mui/material";
import { Heart } from "lucide-react";
import Link from "next/link";

const renderUserPopovers = () => (
  <>
    <NavbarLeftPopoverMessages />
    <NavbarLeftPopoverNotifications />
    <NavbarLeftPopoverOrder />
    <Link href={route.buyer.favorites}>
      <Badge
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
      </Badge>
    </Link>
    <NavbarLeftPopoverAvatar />
  </>
);

const NavbarMain = () => {
  const user = useAppSelector(selectUser);

  return (
    <div>
      {/* Mobile Navbar */}
      <nav className="grid grid-cols-3 items-center md:hidden">
        <NavbarLeft />

        <Link href="/" className="justify-self-center">
          <Logo />
        </Link>

        <div className="justify-self-end">
          <NavbarLeftLoginDialog />
        </div>
      </nav>

      {/* Search bar for mobile */}
      <div className="my-2 md:hidden">
        <NavbarSearchBar />
      </div>

      {/* Desktop Navbar */}
      <nav className="hidden md:flex md:items-center md:justify-between md:px-4">
        <div className="flex items-center space-x-4">
          <NavbarLeft />
          <Link href="/">
            <Logo />
          </Link>
        </div>

        <div className="mx-4 flex-1">
          <NavbarSearchBar />
        </div>

        <div className="flex items-center space-x-4">
          {user ? renderUserPopovers() : <NavbarLeftLoginDialog />}
        </div>
      </nav>

      {/* Category menu always visible */}
      <NavbarMainCategoryMenu />
    </div>
  );
};

export default NavbarMain;
