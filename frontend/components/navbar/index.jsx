"use client";

import clsx from "clsx";
import Link from "next/link";
import Logo from "../logo";
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

        <Link href="/" className="justify-self-center  ">
          <Logo />
        </Link>

        <div className="hidden w-full md:block">
          <SearchBar />
        </div>

        <div className="justify-self-end" >
          <LoginDialog />
        </div>
      </nav>

      <CategoriesMenu />
    </div>
  );
};

export default Navbar;
