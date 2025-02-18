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
  SheetTrigger,
} from "@/components/ui/sheet";
import { categoriesNavLinks } from "@/data/data";
import { stringAvatar } from "@/lib/utils";

import logo from "@/public/logo.svg";
import { Avatar, Divider } from "@mui/material";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="grid grid-cols-3 items-center">
      <Sheet>
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
          <div className="my-2 flex flex-row items-center [&>div]:mr-2">
            <Avatar {...stringAvatar("Mai Dat")} />
            <Avatar alt="Remy Sharp" src="/avatar/1.jpg" />
            <div>Mai Dat</div>
          </div>
          <Divider />

          <SheetClose asChild className="block">
            <Link href="/">Home</Link>
          </SheetClose>

          <SheetClose asChild className="block">
            <Link href="/inbox">Inbox</Link>
          </SheetClose>

          <SheetClose asChild className="block">
            <Link href="/orders">Manage Orders</Link>
          </SheetClose>

          <SheetClose asChild className="block">
            <Link href="/lists">Fovorite Lists</Link>
          </SheetClose>

          <Accordion type="single" collapsible>
            <AccordionItem value="item-1" className="border-none font-[Arial]">
              <AccordionTrigger>
                <p>Browse categories</p>
              </AccordionTrigger>

              {categoriesNavLinks.map((categortLink) => (
                <AccordionContent className="pl-4">
                  <Link href={categortLink.to}> {categortLink.title}</Link>
                </AccordionContent>
              ))}
            </AccordionItem>
          </Accordion>

          <div>
            <p className="font-bold">General</p>

            <SheetClose asChild className="block">
              <Link href="#">Setting</Link>
            </SheetClose>

            <SheetClose asChild className="block">
              <Link href="#">Billing and payments</Link>
            </SheetClose>

            <SheetClose asChild className="block">
              <button
                onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
              >
                Logout
              </button>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>

      <Link href="/">
        <Image
          alt="logo"
          height={50}
          width={50}
          src={logo}
          className="justify-self-center"
        />
      </Link>
    </nav>
  );
};

export default Navbar;
