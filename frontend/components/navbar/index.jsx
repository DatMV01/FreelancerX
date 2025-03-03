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

const Navbar = () => {
  return (
    <div>
      <nav
        className={clsx(
          "grid grid-cols-3 items-center",
          "md:flex md:items-center md:space-x-2",
        )}
      >
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

        <div className="hidden space-x-4 md:flex">
          <PopoverMessages />
          <PopoverNotifications />
          <PopoverOrders />
          <PopoverFavoriteListing />
          <AvatarOnline />
        </div>
      </nav>

      <div className="my-2 md:hidden">
        <SearchBar />
      </div>

      <CategoriesMenu />
    </div>
  );
};

export default Navbar;
