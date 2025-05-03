import PaginationWithPageSize from "@/components/PaginationWithPageSize";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  CheckCircle,
  Clock,
  DollarSign,
  HelpCircle,
  XCircle,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { WalletTransactionEntity } from "../wallet.type";
const renderStatus = (status: string) => {
  switch (status) {
    case "SUCCESS":
      return (
        <Badge className="flex items-center gap-1 bg-green-100 text-green-700">
          <CheckCircle size={14} /> Success
        </Badge>
      );
    case "PENDING":
      return (
        <Badge className="flex items-center gap-1 bg-yellow-100 text-yellow-800">
          <Clock size={14} /> Pending
        </Badge>
      );
    case "FAILED":
      return (
        <Badge className="flex items-center gap-1 bg-red-100 text-red-700">
          <XCircle size={14} /> Failed
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
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

interface Props {
  transactions: WalletTransactionEntity[];
}

export default function WalletTransactionList({ transactions }: Props) {
  if (!transactions?.length) {
    return (
      <div className="text-muted-foreground text-center">No transactions</div>
    );
  }
  return (
    <div>
      <ScrollArea className="h-[400px] w-full rounded-md border">
        <div className="space-y-2 p-4">
          {transactions.map((tx) => (
            <Card key={tx.id} className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="text-sm font-semibold">{tx.description}</div>
                <Badge variant="outline">{tx.currency}</Badge>
              </CardHeader>

              <CardContent className="flex items-center justify-between text-sm">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <ArrowDownCircle className="h-4 w-4 text-blue-600" />
                    <span>Amount:</span>
                    <span className="font-medium text-blue-600">
                      ${tx.amount}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="text-muted-foreground h-4 w-4" />
                    <span>
                      {format(new Date(tx.createdAt), "dd/MM/yyyy HH:mm")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span>Status:</span>
                    {renderStatus(tx.status)}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-muted-foreground flex gap-x-1 text-xs">
                    Method: {tx.method}
                  </div>
                  <div className="text-muted-foreground flex gap-x-1 text-xs">
                    Type: {renderType(tx.type)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
      <PaginationWithPageSize totalItems={transactions?.length ?? 0} />;
    </div>
  );
}
