import { useRouter } from "next/router";
import React from "react";

const SellerOnBoarding = () => {
  const router = useRouter();
  const { slug } = router.query;
  return (
    <div>
      <div> Seller Profile</div>
      <div>{slug}</div>
    </div>
  );
};

export default SellerOnBoarding;
