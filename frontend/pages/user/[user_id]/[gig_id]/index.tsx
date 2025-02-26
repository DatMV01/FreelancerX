import BreadcrumbCpn from "@/components/breadcrumb";
import React from "react";

const GigDetail = () => {
  return (
    <div>
      <BreadcrumbCpn
        categoryInfo={{
          category: "programming-tech",
          subcategory: "website-development",
          subsubcategory: "shopify",
        }}
      />
      GigDetail
    </div>
  );
};

export default GigDetail;
