"use client";

import NestedSubCategoryPage from "@/features/categories/NestedSubCategoryPage";
import RootCategoryPage from "@/features/categories/RootCategoryPage";
import SubCategoryPage from "@/features/categories/SubCategoryPage";
import { useRouter } from "next/router";

const CategoriesPage = () => {
  const router = useRouter();

  const { slug } = router.query;

  if (!Array.isArray(slug)) return null;

  switch (slug.length) {
    case 1:
      return <RootCategoryPage />;
    case 2:
      return <SubCategoryPage />;
    case 3:
      return <NestedSubCategoryPage />;
    default:
      return null;
  }
};

export default CategoriesPage;
