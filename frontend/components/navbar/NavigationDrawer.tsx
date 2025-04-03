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
import { categories } from "@/data/data";
import UserAvatar from "@/features/user/components/UserAvatar";
import useGetUserInfo from "@/hooks/useGetUserInfo";
import { Divider } from "@mui/material";
import clsx from "clsx";
import { AlignJustify } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { VisuallyHidden } from "radix-ui";
import { useState } from "react";
import { BrowseCategoryNav } from "./BrowseCategoryNav";
import LoginDialog from "./LoginDialog";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectIsLogin, selectUser } from "@/lib/redux/features/auth/authSlice";
import { useSearchParams } from "next/navigation";
import LogoutButton from "@/features/auth/components/LogoutButton";

const NavigationDrawer = () => {
  const searchParams = useSearchParams();

  const dev = false || searchParams.get("dev");

  const router = useRouter();
  const [open, setOpen] = useState(false);
  // const { isAuthenticated, user, session } = useGetUserInfo();

  const user = useAppSelector(selectUser);
  const fullName = user?.fullName || "Guest";

  const isLogin = useAppSelector(selectIsLogin);

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
            {!isLogin && (
              <div className="flex justify-center">
                <LoginDialog />
              </div>
            )}

            {isLogin && (
              <div className="flex items-center space-x-2">
                <UserAvatar />
                <div>{fullName}</div>
              </div>
            )}
            <Divider className="py-2" />
          </SheetTitle>
          <VisuallyHidden.Root>
            <SheetDescription>SheetDescription</SheetDescription>
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
          <SheetClose asChild>
            <Link
              className="flex w-full items-center p-2 hover:bg-green-50 hover:text-green-500"
              href="/"
            >
              Home
            </Link>
          </SheetClose>

          {isLogin && (
            <>
              <SheetClose asChild>
                <Link
                  className="flex w-full items-center p-2 hover:bg-green-50 hover:text-green-500"
                  href="/inbox"
                >
                  Inbox
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link
                  className="flex w-full items-center p-2 hover:bg-green-50 hover:text-green-500"
                  href="/orders"
                >
                  Manage Orders
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link
                  className="flex w-full items-center p-2 hover:bg-green-50 hover:text-green-500"
                  href="/lists"
                >
                  Fovorite Lists
                </Link>
              </SheetClose>
            </>
          )}

          <Accordion type="single" collapsible>
            <AccordionItem value="item-1" className="m-2">
              <AccordionTrigger className="h-[40px] text-base font-bold">
                Browse categories
              </AccordionTrigger>

              {categories &&
                categories.map((category) => (
                  <AccordionContent
                    className="flex h-[40px] items-center pb-0 pl-4 text-base"
                    key={category.id}
                  >
                    <BrowseCategoryNav category={category} setOpen={setOpen} />
                  </AccordionContent>
                ))}
            </AccordionItem>
          </Accordion>

          {isLogin && !user?.freelancer && (
            <SheetClose asChild className="flex w-full">
              <Link
                href="/freelancer/onboarding"
                className="p-2 text-green-500 hover:bg-green-50 hover:text-green-500"
              >
                Become a Freelancer
              </Link>
            </SheetClose>
          )}

          {user?.freelancer && (
            <Accordion type="single" collapsible defaultValue="item-1">
              <AccordionItem value="item-1" className="m-2">
                <AccordionTrigger className="h-[40px] text-base font-bold">
                  My Business
                </AccordionTrigger>
                <AccordionContent className="flex flex-col items-center text-base">
                  <Link
                    className="w-full p-2 hover:bg-green-50 hover:text-green-500"
                    href={""}
                  >
                    Orders
                  </Link>
                  <Link
                    className="w-full p-2 hover:bg-green-50 hover:text-green-500"
                    href="/gigs/manage"
                  >
                    Gigs
                  </Link>
                  <Link
                    className="w-full p-2 hover:bg-green-50 hover:text-green-500"
                    href={""}
                  >
                    Profile
                  </Link>
                  <Link
                    className="w-full p-2 hover:bg-green-50 hover:text-green-500"
                    href="/earning"
                  >
                    Earnings
                  </Link>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          {isLogin && (
            <>
              <div className="p-2">
                <div className="flex w-full items-center text-base font-bold">
                  General
                </div>

                {dev && (
                  <>
                    <SheetClose asChild className="flex w-full">
                      <Link
                        href={`/setting`}
                        className="p-2 hover:bg-green-50 hover:text-green-500"
                      >
                        Settings
                      </Link>
                    </SheetClose>
                    <SheetClose asChild className="flex w-full">
                      <Link
                        href="/billing"
                        className="p-2 hover:bg-green-50 hover:text-green-500"
                      >
                        Billing and payments
                      </Link>
                    </SheetClose>
                  </>
                )}

                <SheetClose asChild>
                  <LogoutButton
                    className="w-full p-2 text-left hover:bg-green-50 hover:text-green-500"
                    onClickCb={() => {
                      // window.location.reload();
                    }}
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

export default NavigationDrawer;
