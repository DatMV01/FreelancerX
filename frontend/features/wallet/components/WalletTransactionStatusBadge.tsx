"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle, Ban } from "lucide-react";
import React from "react";
import { TransactionStatus } from "../wallet.type";

type Props = {
  status: string;
};

export const WalletTransactionStatusBadge: React.FC<Props> = ({ status }) => {
  const normalized = status.toUpperCase();

  switch (normalized) {
    case TransactionStatus.SUCCESS:
      return (
        <Badge className="flex items-center gap-1 bg-green-100 text-green-700 hover:cursor-default">
          <CheckCircle size={14} /> {TransactionStatus.SUCCESS}
        </Badge>
      );
    case TransactionStatus.PENDING:
      return (
        <Badge className="flex items-center gap-1 bg-yellow-100 text-yellow-800 hover:cursor-default">
          <Clock size={14} /> {TransactionStatus.PENDING}
        </Badge>
      );
    case TransactionStatus.REJECT:
      return (
        <Badge className="flex items-center gap-1 bg-red-100 text-red-700 hover:cursor-default">
          <XCircle size={14} /> {TransactionStatus.REJECT}
        </Badge>
      );
    case TransactionStatus.FAILED:
      return (
        <Badge className="flex items-center gap-1 bg-gray-200 text-gray-800 hover:cursor-default">
          <Ban size={14} /> {TransactionStatus.FAILED}
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
};
