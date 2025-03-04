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
import { stringAvatar } from "@/lib/utils";
import { Avatar, Button, Divider } from "@mui/material";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CategoriesNav } from "./sub-categories-nav";
import { AlignJustify } from "lucide-react";
import LoginDialog from "./login-dialog";
import { VisuallyHidden } from "radix-ui";
import clsx from "clsx";

const NavigationDrawer = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();
  const [isShowJoinButton, setShowJoinButton] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      setShowJoinButton(false);
    }
    if (status === "unauthenticated") {
      setShowJoinButton(true);
    }
  }, [status, router]);

  const user = session?.user;
  const fullName = `${user?.firstName} ${user?.lastName}`;

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
            {isShowJoinButton && <LoginDialog />}

            {!isShowJoinButton && (
              <div className="flex items-center space-x-2">
                {user?.avatar && <Avatar src={user?.avatar}></Avatar>}
                {!user?.avatar && <Avatar {...stringAvatar(fullName || "")} />}
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
                    <CategoriesNav category={category} setOpen={setOpen} />
                  </AccordionContent>
                ))}
            </AccordionItem>
          </Accordion>

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

          <div className="p-2">
            <div className="flex w-full items-center text-base font-bold">
              General
            </div>

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

            <SheetClose asChild>
              <button
                className="w-full p-2 text-left hover:bg-green-50 hover:text-green-500"
                onClick={async () => {
                  //signOut({ redirect: true, callbackUrl: "/" });
                  await signOut({ redirect: false, callbackUrl: "/" });
                  router.push("/");
                }}
              >
                Logout
              </button>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NavigationDrawer;
