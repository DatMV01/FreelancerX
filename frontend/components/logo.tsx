import React from "react";
import logo from "@/public/logo.svg";
import Image from "next/image";

const Logo = (props: any) => {
  return <Image alt="logo" {...props} height={50} width={50} src={logo} />;
};

export default Logo;
