"use client";

import CircularProgressCenter from "@/components/CircularProgressCenter";
import DashboardLayout2 from "@/components/layouts/DashboardLayout2";
import PaginationWithPageSize from "@/components/PaginationWithPageSize";
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
import { DashboardMainContent } from "@/features/dashboard/components/DashboardMainContent";
import { useQuerySync } from "@/hooks/useQuerySync";
import { format } from "date-fns";
import Decimal from "decimal.js";
import { saveAs } from "file-saver";
import { ArrowUpDown, Download, Eye, RefreshCcw } from "lucide-react";
import { VisuallyHidden } from "radix-ui";
import React, { ReactElement, useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { defaultWalletTransactionQuery } from "../hooks/useGetWalletTransactions";
import {
  ActorType,
  transactionStatus,
  WalletTransactionEntity,
} from "../wallet.type";
import { WalletTransactionDetail } from "./WalletTransactionDetail";
import { WalletTransactionMethodBadge } from "./WalletTransactionMethodBadge";
import { WalletTransactionStatusBadge } from "./WalletTransactionStatusBadge";
import { WalletTransactionTypeBadge } from "./WalletTransactionTypeBadge";
import { ppid } from "process";

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

        <TableHead className="cursor-pointer">Description</TableHead>

        <TableHead className="cursor-pointer">ReferenceCode</TableHead>

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
      </TableRow>
    </TableHeader>
  );
};

function WalletTransactionTable({
  isLoading,
  error,
  response,
  mutate,
  actorType,
}: {
  isLoading: boolean;
  error: any;
  response: any;
  mutate: any;
  actorType?: ActorType;
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
    const data = walletTransactions.map((tx) => ({
      ID: tx.id,
      Type: tx.type,
      Status: tx.status,
      Amount: `${tx.amount} ${tx.currency}`,
      Method: tx.method,
      Description: tx.description,
      "Balance Before": tx.balanceBefore,
      "Balance After": tx.balanceAfter,
      "Reference Code": tx.referenceCode,
      "Actor Type": tx.actorType,
      "Processed By": tx.processedBy || "N/A",
      "Created At": format(new Date(tx.createdAt), "dd/MM/yyyy HH:mm"),
      "Processed At": tx.processedAt
        ? format(new Date(tx.processedAt), "dd/MM/yyyy HH:mm")
        : "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(blob, "wallet-transactions.xlsx");
  };

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

      {error && <div>Failed to load data.</div>}

      {isLoading && !error && <CircularProgressCenter />}

      {!isLoading && !error && (
        <Card>
          <CardContent className="p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={query.filters?.status}
                  onChange={(e) => {
                    const value = e.target.value;
                    setQuery({
                      filters: { status: value === "" ? undefined : value },
                      page: 1,
                    });
                  }}
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

                      <TableCell>
                        <WalletTransactionTypeBadge type={_.type} />
                      </TableCell>

                      <TableCell>
                        <WalletTransactionStatusBadge status={_.status} />
                      </TableCell>

                      <TableCell>
                        {new Decimal(_.amount).toFixed(2)} {_.currency}
                      </TableCell>

                      <TableCell>
                        <WalletTransactionMethodBadge method={_.method} />
                      </TableCell>

                      <TableCell className="max-w-[300px] truncate">
                        {_.description}
                      </TableCell>

                      <TableCell>{_.referenceCode}</TableCell>

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
        <DialogContent className="flex h-[90%] w-[800px] flex-col md:max-w-full">
          <VisuallyHidden.Root>
            <DialogHeader>DialogHeader</DialogHeader>
          </VisuallyHidden.Root>

          {selected && (
            <WalletTransactionDetail
              actorType={actorType}
              transaction={selected}
              mutateAllTransactions={mutate}
            />
          )}
        </DialogContent>
      </Dialog>
    </DashboardMainContent>
  );
}

WalletTransactionTable.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout2>{page}</DashboardLayout2>;
};

export default WalletTransactionTable;
