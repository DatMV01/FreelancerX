"use client";

import ScrollableDiv from "@/components/scrollable-div";
import { categoriesMenuData } from "@/data/data";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";

const NavbarMainCategoryMenu = () => {
  const router = useRouter();
  const { category, subcategory, subsubcategory } = router.query;

  return (
    <ScrollableDiv
      showScrollBar={false}
      className="my-2 border-y border-gray-400"
    >
      {categoriesMenuData.map((categoryData) => {
        const isActive =
          category &&
          typeof category === "string" &&
          categoryData.href.includes(category);
        return (
          <Link
            key={categoryData.id}
            className={clsx(
              { "border-b-2 border-green-500": isActive },
              "mr-4 cursor-pointer text-nowrap",
              "p-2 hover:bg-green-100",
            )}
            href={categoryData.href}
          >
            {categoryData.title}
          </Link>
        );
      })}
    </ScrollableDiv>
  );
};

export default NavbarMainCategoryMenu;
