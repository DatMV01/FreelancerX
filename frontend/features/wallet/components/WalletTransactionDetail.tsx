"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import Decimal from "decimal.js";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Ban,
  Bitcoin,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  HandCoins,
  HelpCircle,
  Landmark,
  Send,
  Wallet2,
  XCircle,
} from "lucide-react";
import { TransactionMethod, TransactionStatus } from "../wallet.type";
type WalletTransactionDetailProps = {
  transaction: {
    id: string;
    walletId: string;
    type: string;
    status: string;
    amount: string;
    actorType: string;
    actorId: string;
    referenceCode: string;
    balanceBefore: string;
    balanceAfter: string;
    method: string;
    metadata: Record<string, any>;
    description: string;
    currency: string;
    createdAt: string;
    processedAt: string | null;
    processedBy: string | null;
  };
};

const renderStatus = (status: string) => {
  switch (status.toUpperCase()) {
    case TransactionStatus.SUCCESS:
      return (
        <Badge className="flex items-center gap-1 bg-green-100 text-green-700">
          <CheckCircle size={14} /> {TransactionStatus.SUCCESS}
        </Badge>
      );
    case TransactionStatus.PENDING:
      return (
        <Badge className="flex items-center gap-1 bg-yellow-100 text-yellow-800">
          <Clock size={14} /> {TransactionStatus.PENDING}
        </Badge>
      );
    case TransactionStatus.REJECT:
      return (
        <Badge className="flex items-center gap-1 bg-red-100 text-red-700">
          <XCircle size={14} /> {TransactionStatus.REJECT}
        </Badge>
      );
    case TransactionStatus.FAILED:
      return (
        <Badge className="flex items-center gap-1 bg-gray-200 text-gray-800">
          <Ban size={14} /> {TransactionStatus.FAILED}
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
};

const renderMethod = (method: string) => {
  switch (method) {
    case TransactionMethod.BANK:
      return (
        <Badge className="flex items-center gap-1 bg-blue-100 text-blue-700">
          <Landmark size={14} /> {TransactionMethod.BANK}
        </Badge>
      );
    case TransactionMethod.PAYPAL:
      return (
        <Badge className="flex items-center gap-1 bg-sky-100 text-sky-700">
          <Send size={14} /> {TransactionMethod.PAYPAL}
        </Badge>
      );
    case TransactionMethod.WALLET:
      return (
        <Badge className="flex items-center gap-1 bg-gray-100 text-gray-700">
          <Wallet2 size={14} /> {TransactionMethod.WALLET}
        </Badge>
      );
    case TransactionMethod.CRYPTO:
      return (
        <Badge className="flex items-center gap-1 bg-purple-100 text-purple-700">
          <Bitcoin size={14} /> {TransactionMethod.CRYPTO}
        </Badge>
      );
    case TransactionMethod.STRIPE:
      return (
        <Badge className="flex items-center gap-1 bg-indigo-100 text-indigo-700">
          <CreditCard size={14} /> {TransactionMethod.STRIPE}
        </Badge>
      );
    case TransactionMethod.MANUAL:
      return (
        <Badge className="flex items-center gap-1 bg-zinc-100 text-zinc-700">
          <HandCoins size={14} /> {TransactionMethod.MANUAL}
        </Badge>
      );
    default:
      return <Badge>{method}</Badge>;
  }
};

const renderType = (type: string) => {
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

  const data = map[type as keyof typeof map] || map.DEFAULT;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex items-center gap-1 ${data.className}`}>
            {data.icon}
            {data.short}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{data.label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export function WalletTransactionDetail({
  transaction,
}: WalletTransactionDetailProps) {
  console.log(transaction);
  if (!transaction) return;
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Transaction #{transaction.referenceCode}</CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground space-y-4 text-sm">
        <div className="flex justify-between">
          <span>Id</span>
          <span>{transaction.id}</span>
        </div>
        <div className="flex justify-between">
          <span>Amount</span>
          <span className="font-bold text-black">
            {new Decimal(transaction.amount).toFixed(2)} {transaction.currency}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Type</span>
          <span>{renderType(transaction.type)}</span>
        </div>
        <div className="flex justify-between">
          <span>Status</span>
          <span>{renderStatus(transaction.status)}</span>
        </div>
        <div className="flex justify-between">
          <span>Method</span>
          <span>{renderMethod(transaction.method)}</span>
        </div>
        <div className="flex justify-between">
          <span>Actor</span>
          <span>{transaction.actorType}</span>
        </div>
        <div className="flex justify-between">
          <span>Description</span>
          <span>{transaction.description}</span>
        </div>
        <div className="flex justify-between">
          <span>Balance Before</span>
          <span>{new Decimal(transaction.balanceBefore).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Balance After</span>
          <span>{new Decimal(transaction.balanceAfter).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Created At</span>
          <span>{format(new Date(transaction.createdAt), "PPPppp")}</span>
        </div>
        {transaction.processedAt && (
          <div className="flex justify-between">
            <span>Processed At</span>
            <span>{format(new Date(transaction.processedAt), "PPPppp")}</span>
          </div>
        )}
        {transaction.processedBy && (
          <div className="flex justify-between">
            <span>Processed By</span>
            <span>ADMIN</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
