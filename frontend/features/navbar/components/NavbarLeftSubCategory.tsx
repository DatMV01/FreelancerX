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
import { categories, Category } from "@/data/categories";

import { ArrowRight, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { VisuallyHidden } from "radix-ui";
import { useEffect, useState } from "react";
const side = "left";

const NavbarLeftNestedSubCategory = ({
  subCategory,
  setOpen,
  setOpenParent,
}: {
  subCategory: any;
  setOpen: any;
  setOpenParent: any;
}) => {
  const { id, title, url } = subCategory;
  const [nestedSubCategory, setNestedSubCategory] = useState<Category[]>();

  useEffect(() => {
    const nestedSub = categories.filter((_) => _.parentId === id);
    setNestedSubCategory(nestedSub);
  }, []);

  return (
    <ul className="pl-4">
      {nestedSubCategory &&
        nestedSubCategory.map((_: any) => (
          <li
            key={_.id}
            className="flex w-full cursor-pointer flex-row items-center justify-between p-2 hover:bg-green-50 hover:text-green-500"
          >
            <Link
              href={url}
              onClick={() => {
                setOpen((prev: boolean) => !prev);
                setOpenParent((prev: boolean) => !prev);
              }}
            >
              {_.title}
            </Link>
          </li>
        ))}
    </ul>
  );
};

export function NavbarLeftSubCategory({
  category,
  setOpen: setOpenParent,
}: {
  category: any;
  setOpen: any;
}) {
  if (!category) {
    return;
  }

  const { id, title } = category;
  const [open, setOpen] = useState(false);
  const [subCategory, setSubCategory] = useState<Category[]>();

  useEffect(() => {
    const sub = categories.filter((_) => _.parentId === id);
    setSubCategory(sub);
  }, []);

  return (
    <Sheet key={side} open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div className="flex w-full cursor-pointer flex-row items-center justify-between p-2 hover:bg-green-50 hover:text-green-500">
          <span>{title}</span>
          <ArrowRight size={16} />
        </div>
      </SheetTrigger>
      <SheetContent side={side} className="w-[300px] bg-white p-4">
        <SheetHeader>
          <SheetTitle>
            <div className="grid h-[40px] grid-cols-3 items-center">
              <SheetClose asChild>
                <button className="h-full w-full">
                  <ChevronLeft />
                </button>
              </SheetClose>
              <span className="absolute left-1/2 w-max -translate-x-1/2 transform">
                {title}
              </span>
            </div>
          </SheetTitle>
          <VisuallyHidden.Root>
            <SheetDescription>SheetDescription</SheetDescription>
          </VisuallyHidden.Root>
        </SheetHeader>

        <ScrollArea className="h-full w-full pb-[40px]" type="always">
          {subCategory &&
            subCategory?.map((subCategory: any) => (
              <div key={subCategory.id}>
                <SheetTitle className="flex h-[40px] items-center text-base">
                  {subCategory.title}
                </SheetTitle>

                <NavbarLeftNestedSubCategory
                  setOpen={setOpen}
                  setOpenParent={setOpenParent}
                  subCategory={subCategory}
                  key={subCategory.id}
                />
              </div>
            ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
