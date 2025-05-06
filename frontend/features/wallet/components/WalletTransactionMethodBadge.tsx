"use client";

import {
  Landmark,
  Send,
  Wallet2,
  Bitcoin,
  CreditCard,
  HandCoins,
} from "lucide-react";
import { Badge } from "@/components/ui/badge"; // điều chỉnh path nếu cần
import { TransactionMethod } from "../wallet.type";

type Props = {
  method: string;
};

export const WalletTransactionMethodBadge = ({ method }: Props) => {
  const map = {
    [TransactionMethod.BANK]: {
      icon: <Landmark size={14} />,
      className: "bg-blue-100 text-blue-700",
    },
    [TransactionMethod.PAYPAL]: {
      icon: <Send size={14} />,
      className: "bg-sky-100 text-sky-700",
    },
    [TransactionMethod.WALLET]: {
      icon: <Wallet2 size={14} />,
      className: "bg-gray-100 text-gray-700",
    },
    [TransactionMethod.CRYPTO]: {
      icon: <Bitcoin size={14} />,
      className: "bg-purple-100 text-purple-700",
    },
    [TransactionMethod.STRIPE]: {
      icon: <CreditCard size={14} />,
      className: "bg-indigo-100 text-indigo-700",
    },
    [TransactionMethod.MANUAL]: {
      icon: <HandCoins size={14} />,
      className: "bg-zinc-100 text-zinc-700",
    },
  };

  const data = map[method as TransactionMethod];

  if (!data) {
    return <Badge>{method}</Badge>;
  }

  return (
    <Badge
      className={`flex items-center gap-1 hover:cursor-default ${data.className}`}
    >
      {data.icon}
      {method}
    </Badge>
  );
};
