"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import LeftArrow from "../left-arrow";
import RightArrow from "../right-arrow";
import Link from "next/link";
import { useState } from "react";
import { VisuallyHidden } from "radix-ui";
const side = "left";

export function CategoriesNav({
  category,
  setOpen: setOpenParent,
}: {
  category: any;
  setOpen: any;
}) {
  if (!category) {
    return;
  }

  const { id, title, subCategories } = category;
  const [open, setOpen] = useState(false);

  return (
    <Sheet key={side} open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div className="flex w-full cursor-pointer flex-row items-center justify-between p-2 hover:bg-green-50 hover:text-green-500">
          <span>{title}</span>
          <RightArrow />
        </div>
      </SheetTrigger>
      <SheetContent side={side} className="w-[300px] bg-white p-4">
        <SheetHeader>
          <SheetTitle>
            <div className="grid h-[40px] grid-cols-3 items-center">
              <SheetClose asChild>
                <button className="w-full h-full">
                  <LeftArrow />
                </button>
              </SheetClose>
              <span className="absolute left-1/2 w-max -translate-x-1/2 transform">
                {title}
              </span>
            </div>

            {/* <div className="relative flex items-center">
            <SheetClose asChild>
              <span aria-hidden="true" className="h-[16px] w-[16px] fill-black">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M5.093 13.031c.285.3.747.3 1.031 0a.801.801 0 0 0 0-1.09l-2.803-2.96h10.21c.402 0 .728-.345.728-.77 0-.426-.326-.77-.729-.77H3.173l2.951-3.118a.801.801 0 0 0 0-1.09.702.702 0 0 0-1.031 0L.97 7.589a.801.801 0 0 0 0 1.09l.07.072a.744.744 0 0 0 .01.01l4.043 4.271Z"></path>
                </svg>
              </span>
            </SheetClose>

            <span className="absolute left-1/2 w-max -translate-x-1/2 transform">
              Programming &amp; Tech
            </span>
          </div> */}
          </SheetTitle>
          <VisuallyHidden.Root>
            <SheetDescription>SheetDescription</SheetDescription>
          </VisuallyHidden.Root>
        </SheetHeader>

        <ScrollArea className="h-full w-full pb-[40px]" type="always">
          {subCategories &&
            subCategories.map((subCategory: any) => (
              <div key={subCategory.id}>
                <SheetTitle className="flex h-[40px] items-center text-base">
                  {subCategory.title}
                </SheetTitle>

                <ul className="pl-4" key={subCategory.id}>
                  {subCategory.subCategories &&
                    subCategory.subCategories.map((subCategory: any) => (
                      <li
                        key={subCategory.id}
                
                        className="flex w-full cursor-pointer flex-row items-center justify-between p-2 hover:bg-green-50 hover:text-green-500"
                      >
                        <Link
                          href={`/categories/programming-tech/${subCategory.slug}`}
                          onClick={() => {
                            setOpen((prev: boolean) => !prev);
                            setOpenParent((prev: boolean) => !prev);
                          }}
                        >
                          {subCategory.title}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
