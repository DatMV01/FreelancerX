"use client";

import { useState } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, RefreshCcw } from "lucide-react";
import { fetchFreelancerTransactions } from "@/features/transactions/transactions.api";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectUser } from "@/lib/redux/features/auth/authSlice";
import { formatDate } from "date-fns";

type Transaction = {
  id: string;
  referenceCode: string | null;
  amount: number;
  direction: "IN" | "OUT";
  method?: string;
  type: string;
  status: string;
  freelancerId: string;
  orderId?: string;
  metadata?: Record<string, any>;
  currency: string;
  createdAt: string;
};

export function TransactionList({
  data,
  mutate,
  isLoading,
  setPage,
}: {
  data: any;
  mutate: any;
  setPage: any;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="h-full w-full">
        <Loader2 className="m-auto animate-spin" size={18} />
      </div>
    );
  }

  if (!data) {
    return;
  }

  const transactions = data?.data;
  const page = data?.meta.page ?? 1;
  const totalPages = data?.meta.pageCount ?? 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-x-2">
        <h2 className="text-2xl font-semibold">Transactions</h2>
        <button className="inline-flex" onClick={() => mutate()}>
          <RefreshCcw />
        </button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Direction</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions && transactions.length > 0 ? (
              transactions.map((tx: any) => (
                <TableRow key={tx.id} className="hover:bg-muted/50">
                  <TableCell>{tx.referenceCode || "-"}</TableCell>
                  <TableCell>${tx.amount}</TableCell>
                  <TableCell>{tx.direction}</TableCell>
                  <TableCell>{tx.method || "-"}</TableCell>
                  <TableCell>{tx.type}</TableCell>
                  <TableCell>
                    <span
                      className={
                        tx.status === "SUCCESS"
                          ? "font-semibold text-green-600"
                          : tx.status === "REJECT" || tx.status === "CANCELLED"
                            ? "font-semibold text-red-600"
                            : tx.status === "PENDING"
                              ? "font-semibold text-yellow-600"
                              : ""
                      }
                    >
                      {tx.status}
                    </span>
                  </TableCell>
                  <TableCell>{tx.currency}</TableCell>
                  <TableCell>
                    {formatDate(new Date(tx.createdAt), "dd/MM/yyyy hh:mm")}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-gray-500">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-between px-2">
        <div className="text-muted-foreground text-sm">
          Page {page} of {totalPages}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev: any) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (!totalPages) return;
              if (page < totalPages) setPage((prev: any) => prev + 1);
            }}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
