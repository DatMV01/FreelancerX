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

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="m-0 w-fit">
          <AlignJustify />
        </button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[300px] bg-white p-4">
        <SheetHeader>
          <SheetTitle>
            {user ? (
              <div className="flex items-center space-x-2">
                <UserAvatar />
                <div>{fullName}</div>
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

          {user && (
            <>
              <MenuItem href="/inbox" label="Inbox" />
              <MenuItem href="/orders" label="Manage Orders" />
              <MenuItem href="/fovorites" label="Favorite Lists" />
            </>
          )}

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
            <>
              {freelancer ? (
                <Accordion type="single" collapsible defaultValue="item-1">
                  <AccordionItem value="item-1" className="m-2">
                    <AccordionTrigger className="h-[40px] text-base font-bold">
                      My Business
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col text-base">
                      <MenuItem href="/orders" label="Orders" />
                      <MenuItem href="/gig/manage" label="Gig" />
                      <MenuItem href="/profile" label="Profile" />
                      <MenuItem href="/earning" label="Earnings" />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : (
                <SheetClose asChild>
                  <Link
                    href="/freelancer/new"
                    className="flex w-full items-center p-2 text-green-500 hover:bg-green-50 hover:text-green-500"
                  >
                    Become a Freelancer
                  </Link>
                </SheetClose>
              )}

              <div className="p-2">
                <div className="text-base font-bold">General</div>

                {dev && (
                  <>
                    <MenuItem href="/setting" label="Settings" />
                    <MenuItem href="/billing" label="Billing and payments" />
                  </>
                )}

                <SheetClose asChild>
                  <LogoutButton
                    className="w-full p-2 text-left hover:bg-green-50 hover:text-green-500"
                    onClickCb={() => window.location.reload()}
                  />
                </SheetClose>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NavbarLeft;
