"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { root_categories } from "@/data/categories";
import LogoutButton from "@/features/auth/components/LogoutButton";
import NavbarLeftLoginDialog from "@/features/navbar/components/NavbarLeftLoginDialog";
import { NavbarLeftSubCategory } from "@/features/navbar/components/NavbarLeftSubCategory";
import UserAvatar from "@/features/user/components/UserAvatar";
import {
  selectFreelancer,
  selectUser,
} from "@/lib/redux/features/auth/authSlice";
import { useAppSelector } from "@/lib/redux/hooks";
import { route } from "@/lib/route";
import { Divider } from "@mui/material";
import clsx from "clsx";
import { AlignJustify } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { VisuallyHidden } from "radix-ui";
import { useState } from "react";

const MenuItem = ({ href, label }: { href: string; label: string }) => (
  <SheetClose asChild>
    <Link
      href={href}
      className="flex w-full items-center p-2 hover:bg-green-50 hover:text-green-500"
    >
      {label}
    </Link>
  </SheetClose>
);

const NavbarLeft = () => {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const dev = !!searchParams.get("dev");

  const user = useAppSelector(selectUser);
  const freelancer = useAppSelector(selectFreelancer);

  const fullName = user?.fullName || "Guest";
  const isAdmin = user?.role?.name === "ADMIN";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="m-0 w-fit">
          <AlignJustify />
        </button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[300px] bg-white p-4">
        <SheetHeader className="p-0">
          <SheetTitle>
            {user ? (
              <div className="flex items-center space-x-2">
                <UserAvatar height={50} width={50} />
                <div className="flex-1">
                  <p className="text-xl font-bold text-gray-700">{fullName}</p>
                  <span className="text-md text-gray-500">{user?.email}</span>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <NavbarLeftLoginDialog />
              </div>
            )}

            <Divider className="py-2" />
          </SheetTitle>

          <VisuallyHidden.Root>
            <SheetDescription>Menu</SheetDescription>
          </VisuallyHidden.Root>
        </SheetHeader>

        <div
          className={clsx(
            "h-full overflow-auto",
            "[&::-webkit-scrollbar]:w-1",
            "[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300",
            "[&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100",
          )}
        >
          <MenuItem href="/" label="Home" />

          {isAdmin && (
            <Link
              href={route.admin.users}
              className="flex p-4 hover:bg-green-50 hover:text-green-500"
            >
              Admin Dashboard
            </Link>
          )}

          {!isAdmin && (
            <MenuItem href={route.dashboard.wallet} label="My Dashboarđ" />
          )}

          {/* {!isAdmin && (
              <Link
                href={route.buyer.orders}
                target="_blank"
                className="flex p-4 hover:bg-green-50 hover:text-green-500"
              >
                Buyer Dashboarđ
              </Link>
            )} */}

          {/* {!isAdmin && freelancer && (
              <Link
                href={route.freelancer.profile}
                target="_blank"
                className="flex p-4 hover:bg-green-50 hover:text-green-500"
              >
                Freelancer Dashboarđ
              </Link>
            )} */}

          {!isAdmin && !freelancer && (
            <SheetClose asChild>
              <Link
                href={route.public.freelancer_signup}
                className="flex w-full items-center p-2 text-green-500 hover:bg-green-50 hover:text-green-500"
              >
                Become a Freelancer
              </Link>
            </SheetClose>
          )}

          {/* Profile Links */}
          {/* <div className="grid h-12 grid-cols-2">
              <Link
                href={`/buyer/profile/${username}`}
                className="flex items-center justify-center text-center hover:bg-green-50 hover:text-green-500"
              >
                Buyer Profile
              </Link>

              {user?.freelancer && (
                <Link
                  href={`/freelancer/profile/${user?.freelancer?.email}`}
                  className="flex items-center justify-center text-center hover:bg-green-50 hover:text-green-500"
                >
                  Freelancer Profile
                </Link>
              )}

              {!user?.freelancer && (
                <Link
                  href="/freelancer/new"
                  className="flex items-center justify-center text-center text-green-500 hover:bg-green-50"
                >
                  Become a Freelancer
                </Link>
              )}
            </div> */}

          {/* Switch Profile & Dashboard Links */}
          {/* 
            {!freelancer && (
              <Link
                href="/freelancer/dashboard"
                className="mx-4 my-2 rounded-sm border border-black py-2 text-center font-bold hover:bg-gray-50 hover:text-green-500"
              >
                Freelancer Dashboard
              </Link>
            )} */}

          {/* <DropdownMenuSeparator />

             <Link
              href={`/setting`}
              className="p-4 hover:bg-green-50 hover:text-green-500"
            >
              Settings
            </Link> */}

          {/* <Link
              href={`/billing`}
              className="p-4 hover:bg-green-50 hover:text-green-500"
            >
              Billing and payments
            </Link> */}

          <Accordion type="single" collapsible>
            <AccordionItem value="categories" className="m-2">
              <AccordionTrigger className="h-[40px] text-base font-bold">
                Browse categories
              </AccordionTrigger>
              {root_categories.map((category) => (
                <AccordionContent
                  key={category.id}
                  className="flex h-[40px] items-center pb-0 pl-4 text-base"
                >
                  <NavbarLeftSubCategory
                    category={category}
                    setOpen={setOpen}
                  />
                </AccordionContent>
              ))}
            </AccordionItem>
          </Accordion>

          {user && (
            <div>
              <Divider className="py-2" />
              <div className="p-2 text-base font-bold">General</div>

              {dev && (
                <>
                  <MenuItem href="/setting" label="Settings" />
                  <MenuItem href="/billing" label="Billing and payments" />
                </>
              )}

              <SheetClose asChild>
                <LogoutButton
                  className="flex w-full items-center p-2 hover:bg-green-50 hover:text-green-500"
                  onClickCb={() => window.location.reload()}
                />
              </SheetClose>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NavbarLeft;
