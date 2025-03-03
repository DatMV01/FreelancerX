"use client";

import clsx from "clsx";
import Link from "next/link";
import AvatarOnline from "../avatar_online";
import Logo from "../logo";
import PopoverFavoriteListing from "../popover_favorite_listing";
import PopoverMessages from "../popover_messages";
import PopoverNotifications from "../popover_notification";
import PopoverOrders from "../popover_orders";
import SearchBar from "../searchbar";
import CategoriesMenu from "./categories-menu";
import LoginDialog from "./login-dialog";
import NavigationDrawer from "./navigation-drawer";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PopoverAvatar from "../popover_avatar";

const Navbar = () => {
  const [isShowJoinButton, setShowJoinButton] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      setShowJoinButton(false);
    }
    if (status === "unauthenticated") {
      setShowJoinButton(true);
    }
  }, [status, router]);

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

        <PopoverMessages />
        <PopoverNotifications />
        <PopoverOrders />
        <PopoverFavoriteListing />

        {isShowJoinButton ? <LoginDialog /> : <PopoverAvatar />}
      </nav>
      <div className="my-2 md:hidden">
        <SearchBar />
      </div>

      <CategoriesMenu />
    </div>
  );
};

export default Navbar;
