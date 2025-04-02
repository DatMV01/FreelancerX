import React from "react";
import Image from "next/image";

const Logo = () => {
  return (
    <Image
      alt="logo"
      height={50}
      width={50}
      src={`/freelancerX-logo.png`}
      className="h-auto w-auto"
    />
  );
};

export default Logo;
