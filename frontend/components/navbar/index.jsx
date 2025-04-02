"use client";

import { selectIsLogin, selectUser } from "@/lib/redux/features/auth/authSlice";
import { useAppSelector } from "@/lib/redux/hooks";
import clsx from "clsx";
import Link from "next/link";
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

const Navbar = () => {
  // const {isAuthenticated, user, session} = useGetUserInfo();

  const user = useAppSelector(selectUser);
 

    const isLogin = useAppSelector(selectIsLogin);

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

        {isLogin && (
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
