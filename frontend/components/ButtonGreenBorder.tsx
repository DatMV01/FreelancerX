"use client";

import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { MouseEvent } from "react";

interface Props {
  children: any;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
  className?: string;
}

const ButtonGreenBorder = ({
  children,
  onClick,
  disabled = false,
  type,
  className,
}: Props) => {
  return (
    <Button
      type={type}
      variant="outline"
      disabled={disabled}
      onClick={(e) => {
        onClick(e);
      }}
      className={clsx(
        "rounded-sm border border-green-500 bg-white px-2 py-1",
        "whitespace-nowrap text-green-500",
        "hover:text-green-500",
        className,
      )}
    >
      {children}
    </Button>
  );
};

export default ButtonGreenBorder;
