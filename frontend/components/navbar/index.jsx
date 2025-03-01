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
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { categories } from "@/data/data";
import { stringAvatar } from "@/lib/utils";
import { Avatar, Divider } from "@mui/material";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Logo from "../logo";
import LoginDialog from "./login-dialog";
import { CategoriesNav } from "./sub-categories-nav";
import { useState } from "react";
import ScrollableDiv from "../scrollable-div";
import { categoriesMenuData } from "@/data/data";
import clsx from "clsx";
import { useRouter } from "next/router";
import { faker } from "@faker-js/faker";

const CategoriesMenu = () => {
  const router = useRouter();
  const { category, subcategory, subsubcategory } = router.query;

  return (
    <ScrollableDiv showScrollBar={false} className="my-2 border-y-[2px]">
      {categoriesMenuData.map((categoryData) => {
        const isActive = category && categoryData.href.includes(category);
        return (
          <div
            key={categoryData.id}
            className={clsx(
              "mr-4 text-nowrap rounded-sm border-b-4 border-transparent py-2",
              "active::border-green-500 hover:cursor-pointer hover:border-b-4",
              { "border-green-500": isActive },
            )}
          >
            <Link href={categoryData.href}>{categoryData.title}</Link>
          </div>
        );
      })}
    </ScrollableDiv>
  );
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  return (
    <div>
      <nav className="grid grid-cols-3 items-center">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="w-[50px] border-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="23"
                height="19"
                viewBox="0 0 23 19"
              >
                <rect y="16" width="23" height="3" rx="1.5" fill="#555"></rect>
                <rect width="23" height="3" rx="1.5" fill="#555"></rect>
                <rect y="8" width="23" height="3" rx="1.5" fill="#555"></rect>
              </svg>
            </button>
          </SheetTrigger>

          <SheetContent side="left" className="bg-white">
            <SheetTitle>
              <div className="my-2 flex flex-row items-center [&>div]:mr-2">
                <Avatar {...stringAvatar("Mai Dat")} />
                <Avatar alt="Remy Sharp" src="/avatar/1.jpg" />
                <div>Mai Dat</div>
              </div>

              <Divider className="mb-2 mt-4" />
            </SheetTitle>

            <ScrollArea className="h-full w-full" type="always">
              <SheetClose asChild className="flex h-[40px] items-center">
                <Link href="/">Home</Link>
              </SheetClose>

              <SheetClose asChild className="flex h-[40px] items-center">
                <Link href="/inbox">Inbox</Link>
              </SheetClose>

              <SheetClose asChild className="flex h-[40px] items-center">
                <Link href="/orders">Manage Orders</Link>
              </SheetClose>

              <SheetClose asChild className="flex h-[40px] items-center">
                <Link href="/lists">Fovorite Lists</Link>
              </SheetClose>

              <Accordion type="single" collapsible>
                <AccordionItem
                  value="item-1"
                  className="border-none font-[Arial]"
                >
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

              <div className="flex h-[20px] items-center">
                <hr className="w-full" />
              </div>

              <div>
                <div className="flex h-[40px] w-full items-center text-base font-bold">
                  General
                </div>

                <SheetClose
                  asChild
                  className="flex h-[40px] w-full items-center"
                >
                  <Link href="#">Setting</Link>
                </SheetClose>

                <SheetClose
                  asChild
                  className="flex h-[40px] w-full items-center"
                >
                  <Link href="#">Billing and payments</Link>
                </SheetClose>

                <SheetClose
                  asChild
                  className="flex h-[40px] w-full items-center"
                >
                  <button
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
            </ScrollArea>
          </SheetContent>
        </Sheet>

        <Link href="/" className="justify-self-center">
          <Logo />
        </Link>

        <LoginDialog />
      </nav>

      <CategoriesMenu />
    </div>
  );
};

export default Navbar;
