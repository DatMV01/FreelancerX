"use client";

import CircularProgressCenter from "@/components/CircularProgressCenter";
import DashboardLayout2 from "@/components/layouts/DashboardLayout2";
import PaginationWithPageSize from "@/components/PaginationWithPageSize";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DashboardMainContent } from "@/features/dashboard/components/DashboardMainContent";
import { orderFreelancerStatus } from "@/features/order/dto";
import { fetchBuyerOrders } from "@/features/order/order.api";
import { format, formatDate } from "date-fns";
import Decimal from "decimal.js";
import { saveAs } from "file-saver";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowUpDown,
  Ban,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Eye,
  HelpCircle,
  RefreshCcw,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/router";
import { VisuallyHidden } from "radix-ui";
import React, { ReactElement, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import * as XLSX from "xlsx";
import { WalletTransactionDetail } from "./WalletTransactionDetail";
import {
  Banknote,
  CreditCard,
  Wallet2,
  Bitcoin,
  Landmark,
  Send,
  HandCoins,
} from "lucide-react";
import {
  TransactionMethod,
  TransactionStatus,
  transactionStatus,
  WalletTransactionEntity,
} from "../wallet.type";
import { useFilterParams } from "@/hooks/useFilterParams";
import { useQuerySync } from "@/hooks/useQuerySync";
import { defaultWalletTransactionQuery } from "../hooks/useGetWalletTransactions";

const TableHeaderSection = ({
  handleSort,
  getSortIcon,
}: {
  handleSort: any;
  getSortIcon: any;
}) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>#</TableHead>

        <TableHead
          onClick={() => handleSort("type")}
          className="cursor-pointer"
        >
          Type {getSortIcon("type")}
        </TableHead>

        <TableHead
          onClick={() => handleSort("status")}
          className="cursor-pointer"
        >
          Status {getSortIcon("status")}
        </TableHead>

        <TableHead
          onClick={() => handleSort("amount")}
          className="cursor-pointer"
        >
          Amount {getSortIcon("amount")}
        </TableHead>

        <TableHead
          onClick={() => handleSort("method")}
          className="cursor-pointer"
        >
          Method {getSortIcon("method")}
        </TableHead>

        <TableHead
          onClick={() => handleSort("currency")}
          className="cursor-pointer"
        >
          Currency {getSortIcon("currency")}
        </TableHead>

        <TableHead
          onClick={() => handleSort("createdAt")}
          className="cursor-pointer"
        >
          Create Date {getSortIcon("createdAt")}
        </TableHead>

        <TableHead
          onClick={() => handleSort("processedAt")}
          className="cursor-pointer"
        >
          Process Date {getSortIcon("processedAt")}
        </TableHead>

        <TableHead className="cursor-pointer">Description</TableHead>

        <TableHead className="cursor-pointer">ReferenceCode</TableHead>
      </TableRow>
    </TableHeader>
  );
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
    // case TransactionMethod.VNPAY:
    //   return (
    //     <Badge className="flex items-center gap-1 bg-rose-100 text-rose-700">
    //       <CreditCard size={14} /> {TransactionMethod.VNPAY}
    //     </Badge>
    //   );
    // case TransactionMethod.MOMO:
    //   return (
    //     <Badge className="flex items-center gap-1 bg-pink-100 text-pink-700">
    //       <CreditCard size={14} /> {TransactionMethod.MOMO}
    //     </Badge>
    //   );
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

function WalletTransactionTable({
  isLoading,
  error,
  response,
  mutate,
}: {
  isLoading: boolean;
  error: any;
  response: any;
  mutate: any;
}) {
  const [detailOpen, setDetailOpen] = useState(false);
  const [pagingMetadata, setPagingMetadata] = useState<any>();
  const [selected, setSelected] = useState();
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const [walletTransactions, setWalletTransactions] = useState<any[]>([]);

  const { query, queryString, setQuery, resetQuery } =
    useQuerySync<WalletTransactionEntity>(defaultWalletTransactionQuery);

  const pageSize = Number(query?.pageSize);
  const page = Number(query?.page ?? 1);
  const totalItems = pagingMetadata?.itemCount ?? 1;

  useEffect(() => {
    if (response) {
      setWalletTransactions(response.data as any);
      setPagingMetadata(response.meta);
    }
  }, [response]);

  const filteredOrders = useMemo(() => {
    //const {    status } = query.filters;

    return walletTransactions.filter((_: any) => {
      //    const matchesStatus = status ? _.status === status : true;

      return true;
    });
  }, [walletTransactions, query.filters]);

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      } else {
        return { key, direction: "asc" };
      }
    });
  };

  const getNestedValue = (obj: any, path: any) => {
    return path.split(".").reduce((acc: any, part: any) => acc?.[part], obj);
  };

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;

    const aVal = getNestedValue(a, key);
    const bVal = getNestedValue(b, key);

    if (aVal === bVal) return 0;

    if (key === "amount") {
      return direction === "asc"
        ? new Decimal(aVal).minus(new Decimal(bVal)).toNumber()
        : new Decimal(bVal).minus(new Decimal(aVal)).toNumber();
    }

    if (key === "createdAt" || key === "processedAt") {
      return direction === "asc"
        ? new Date(aVal).getTime() - new Date(bVal).getTime()
        : new Date(bVal).getTime() - new Date(aVal).getTime();
    }

    return direction === "asc"
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  const getSortIcon = (key: string) => {
    if (sortConfig?.key !== key)
      return <ArrowUpDown className="inline h-4 w-4" />;
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  const handleExportExcel = () => {
    const data = walletTransactions.map((_) => {
      return {
        title: _?.title,
        basicPrice: _?.basicPrice,
        standardPrice: _?.standardPrice,
        premiumPrice: _?.premiumPrice,
        status: _?.status,
        ratingAverate: _?.ratingAverate,
        views: _?.views,
        orderCount: _?.orderCount,
        createdAt: formatDate(new Date(_?.createdAt), "dd/MM/yyyy"),
      };
    });
    const worksheet = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, "Earnings");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `gigs.xlsx`);
  };

  if (error) return <div>Failed to load data.</div>;

  return (
    <DashboardMainContent>
      <div className="flex items-center gap-x-2">
        <p className="text-xl font-bold">Wallet Transactions</p>
        <Button
          variant="outline"
          onClick={() => {
            mutate();
          }}
        >
          <RefreshCcw />
        </Button>
      </div>

      {isLoading && <CircularProgressCenter />}

      {!isLoading && (
        <Card>
          <CardContent className="p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={query.filters?.status}
                  onChange={(e) =>
                    setQuery({ filters: { status: e.target.value }, page: 1 })
                  }
                  className="rounded border px-2 py-1 text-sm"
                >
                  <option value="">All Statuses</option>
                  {transactionStatus.map((_) => (
                    <option key={_} value={_}>
                      {_}
                    </option>
                  ))}
                </select>

                <Button variant="outline" onClick={handleExportExcel}>
                  <Download className="mr-1 h-4 w-4" /> Export Excel
                </Button>
              </div>
            </div>
            <Table>
              <TableHeaderSection
                handleSort={handleSort}
                getSortIcon={getSortIcon}
              />

              <TableBody>
                {sortedOrders.map((_, index) => (
                  <React.Fragment key={_.id}>
                    {/* Information */}
                    <TableRow className="w-fit">
                      <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>

                      <TableCell>{renderType(_.type)}</TableCell>

                      <TableCell>{renderStatus(_.status)}</TableCell>

                      <TableCell>{new Decimal(_.amount).toFixed(2)}</TableCell>

                      <TableCell>{renderMethod(_.method)}</TableCell>

                      <TableCell>{_.currency}</TableCell>

                      <TableCell>
                        <div className="flex">
                          {format(_.createdAt, "dd/MM/yyyy HH:mm")}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex">
                          {_.processedAt &&
                            format(_.processedAt, "dd/MM/yyyy HH:mm")}
                        </div>
                      </TableCell>

                      <TableCell className="max-w-[300px] truncate">
                        {_.description}
                      </TableCell>
                      <TableCell>{_.referenceCode}</TableCell>
                    </TableRow>

                    {/* Action */}
                    <TableRow className="w-fit">
                      <TableCell colSpan={11} className="bg-gray-50 pl-10">
                        <Button
                          onClick={() => {
                            setSelected(_);
                            setDetailOpen(true);
                          }}
                          variant="outline"
                        >
                          <Eye className="h-4" /> View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
            <PaginationWithPageSize totalItems={totalItems} />;
          </CardContent>
        </Card>
      )}

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="flex flex-col md:max-w-4xl">
          <VisuallyHidden.Root>
            <DialogHeader>DialogHeader</DialogHeader>
          </VisuallyHidden.Root>

          {selected && <WalletTransactionDetail transaction={selected} />}
        </DialogContent>
      </Dialog>
    </DashboardMainContent>
  );
}

WalletTransactionTable.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout2>{page}</DashboardLayout2>;
};

export default WalletTransactionTable;
