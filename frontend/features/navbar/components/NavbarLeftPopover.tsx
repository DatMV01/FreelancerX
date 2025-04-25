import React from "react";
import NavbarLeftPopoverMessages from "./NavbarLeftPopoverMessages";
import NavbarLeftPopoverNotifications from "./NavbarLeftPopoverNotifications";
import NavbarLeftPopoverOrder from "./NavbarLeftPopoverOrder";
import NavbarLeftPopoverFavoriteGig from "./NavbarLeftPopoverFavoriteGig";
import NavbarLeftPopoverAvatar from "./NavbarLeftPopoverAvatar";

const NavbarLeftPopover = () => {
  return (
    <>
      <NavbarLeftPopoverMessages />
      <NavbarLeftPopoverNotifications />
      <NavbarLeftPopoverOrder />
      <NavbarLeftPopoverFavoriteGig />
      <NavbarLeftPopoverAvatar />
    </>
  );
};

export default NavbarLeftPopover;
