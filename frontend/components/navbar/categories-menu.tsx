"use client";

import { categoriesMenuData } from "@/data/data";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import ScrollableDiv from "../scrollable-div";

const CategoriesMenu = () => {
  const router = useRouter();
  const { category, subcategory, subsubcategory } = router.query;

  return (
    <ScrollableDiv showScrollBar={false} className="my-2 border-y-[2px]">
      {categoriesMenuData.map((categoryData) => {
        const isActive =
          category &&
          typeof category === "string" &&
          categoryData.href.includes(category);
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

export default CategoriesMenu;
