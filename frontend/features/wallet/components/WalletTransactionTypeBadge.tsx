"use client";

import {
  ArrowDownCircle,
  ArrowUpCircle,
  DollarSign,
  HelpCircle,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // đường dẫn này tùy vào project bạn

type Props = {
  type: string;
};

export const WalletTransactionTypeBadge = ({ type }: Props) => {
  const map = {
    EARNING: {
      label: "Earning - You get paid for the order",
      icon: <ArrowDownCircle size={16} className="text-green-700" />,
      className: "text-green-700",
      short: "Earning",
    },
    WITHDRAW: {
      label: "Withdraw - You withdraw money from your wallet",
      icon: <ArrowUpCircle size={16} className="text-blue-700" />,
      className: "text-blue-700",
      short: "Withdraw",
    },
    REFUND: {
      label: "Refund - Money is refunded",
      icon: <DollarSign size={16} className="text-purple-700" />,
      className: "text-purple-700",
      short: "Refund",
    },
    DEFAULT: {
      label: "Unknown transaction type",
      icon: <HelpCircle size={16} className="text-gray-500" />,
      className: "text-gray-500",
      short: type,
    },
  };

  const data = map[type.toUpperCase() as keyof typeof map] || map.DEFAULT;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`flex items-center gap-1 ${data.className} hover:cursor-default`}
          >
            {data.icon}
            <span>{data.short}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{data.label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
