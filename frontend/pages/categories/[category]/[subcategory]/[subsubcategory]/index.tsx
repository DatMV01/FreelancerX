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

const Page = () => {
  const router = useRouter();

  const { category, subcategory, subsubcategory } = router.query;

  return (
    <div>
      <BreadcrumbCpn />
    </div>
  );
};

export default Page;
