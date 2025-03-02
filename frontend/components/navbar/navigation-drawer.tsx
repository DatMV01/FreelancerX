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

      <SheetContent side="left" className="bg-white">
        <SheetHeader>
          <SheetTitle>
            {isShowJoinButton && <LoginDialog />}

            {!isShowJoinButton && (
              <div className="my-2 flex flex-row items-center [&>div]:mr-2">
                {user?.avatar && <Avatar src={user?.avatar as string}></Avatar>}
                {!user?.avatar && <Avatar {...stringAvatar(fullName || "")} />}
                <div>{fullName}</div>
              </div>
            )}

            <Divider className="mb-2 mt-4" />
          </SheetTitle>
          <VisuallyHidden.Root>
            <SheetDescription>SheetDescription</SheetDescription>
          </VisuallyHidden.Root>
        </SheetHeader>

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
            <AccordionItem value="item-1" className="border-none font-[Arial]">
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

            <SheetClose asChild className="flex h-[40px] w-full items-center">
              <Link href="#">Setting</Link>
            </SheetClose>

            <SheetClose asChild className="flex h-[40px] w-full items-center">
              <Link href="#">Billing and payments</Link>
            </SheetClose>

            <SheetClose asChild className="flex h-[40px] w-full items-center">
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

            <div className="my-2 flex flex-row items-center [&>div]:mr-2">
              <Avatar {...stringAvatar("Mai Dat")} />
              <Avatar alt="Remy Sharp" src="/avatar/1.jpg" />
              <div>Mai Dat</div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default NavigationDrawer;
