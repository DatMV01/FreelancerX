"use client";

import React from "react";
import { useRouter } from "next/router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import BreadcrumbCpn from "@/components/breadcrumb";
import { findCategoryBySlug } from "@/data/data";
import { consoleLog } from "@/utils/console";
import { useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";

const Page = () => {
  const router = useRouter();

  const { category, subcategory, subsubcategory } = router.query;

  const _subcategory = findCategoryBySlug(subcategory as String);

  return (
    <div>
      <BreadcrumbCpn />

      {_subcategory && (
        <div>
          <h1 className="text-3xl font-bold">{_subcategory.title}</h1>
          <p className="font-medium text-[#74767E]">
            {_subcategory.description}
          </p>
        </div>
      )}

      
    </div>
  );
};

export default Page;
