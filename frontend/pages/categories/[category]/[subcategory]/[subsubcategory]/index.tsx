import React from "react";
import { useRouter } from "next/router";
const Page = () => {
  const router = useRouter();

  const { category, subcategory, subsubcategory } = router.query;

  return (
    <div>
      <div>
        <h1>Category: {category}</h1>
        {subcategory && <h2>Subcategory: {subcategory}</h2>}
        {subsubcategory && <h3>Sub-subcategory: {subsubcategory}</h3>}
      </div>
    </div>
  );
};

export default Page;
