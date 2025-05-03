import clsx from "clsx";
import React from "react";

type Props = { children: React.ReactNode };

const DashboardMainContentHeader = ({ children }: Props) => {
  return (
    <div
      className={clsx(
        "flex items-center justify-center gap-x-2 border border-green-500 p-2",
        "rounded-md text-center text-2xl font-bold text-green-500",
      )}
    >
      {children}
    </div>
  );
};

const DashboardMainContent = ({ children }: Props) => {
  return <div className="flex flex-col space-y-4">{children}</div>;
};

export { DashboardMainContent, DashboardMainContentHeader };
