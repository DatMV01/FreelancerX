"use client";

import clsx from "clsx";
import Link from "next/link";
import useGetUserInfo from "@/hooks/useGetUserInfo";
import Logo from "../LogoImage";
import PopoverAvatar from "../popover_avatar";
import PopoverFavoriteListing from "../popover_favorite_listing";
import PopoverMessages from "../popover_messages";
import PopoverNotifications from "../popover_notification";
import PopoverOrders from "../popover_orders";
import SearchBar from "../searchbar";
import CategoryMenu from "./CategoryMenu";
import LoginDialog from "./LoginDialog";
import NavigationDrawer from "./NavigationDrawer";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const Navbar = () => {
  // const [isAuthenticated, user, session] = useGetUserInfo();
  const {isAuthenticated, user, session} = useGetUserInfo();

  // const [isAuthenticated, setAuthenticated] = useState(false);
  // const { data: session, status } = useSession();
  // const router = useRouter();

  // useEffect(() => {
  //   if (status === "authenticated") {
  //     setAuthenticated(true);
  //   }
  //   if (status === "unauthenticated" || status === "loading") {
  //     setAuthenticated(false);
  //   }
  // }, [status, router]);

  return (
    <div>
      <nav className={clsx("grid grid-cols-3 items-center", "md:hidden")}>
        <NavigationDrawer />

        <Link href="/" className="justify-self-center">
          <Logo />
        </Link>

        <div className="hidden w-full md:block">
          <SearchBar />
        </div>

        <div className="justify-self-end">
          <LoginDialog />
        </div>
      </nav>

      <nav className={clsx("hidden", "md:flex md:items-center md:space-x-4")}>
        <NavigationDrawer />

        <Link href="/" className="justify-self-center">
          <Logo />
        </Link>

        <div className="hidden w-full md:block">
          <SearchBar />
        </div>

        {isAuthenticated && (
          <>
            <PopoverMessages />
            <PopoverNotifications />
            <PopoverOrders />
            <PopoverFavoriteListing />
            <PopoverAvatar />
          </>
        )}

        <LoginDialog />
      </nav>
      <div className="my-2 md:hidden">
        <SearchBar />
      </div>

      <CategoryMenu />
    </div>
  );
};

export default Navbar;
