"use client";

import React from "react";
import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  onClick: () => void;
};

const ButtonGreenBorder = ({ title, onClick }: Props) => {
  return (
    <Button
      variant="outline"
      onClick={() => {
        onClick();
      }}
      className="rounded-sm border border-green-500 bg-white px-2 py-1 whitespace-nowrap text-green-500"
    >
      {title}
    </Button>
  );
};

export default ButtonGreenBorder;
