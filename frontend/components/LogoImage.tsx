import React from "react";
import logo from "@/public/freelancerX-logo.png";
import Image from "next/image";

const Logo = () => {
  return (
    <Image
      alt="logo"
      height={50}
      width={50}
      src={logo}
      className="h-auto w-auto"
    />
  );
};

export default Logo;
