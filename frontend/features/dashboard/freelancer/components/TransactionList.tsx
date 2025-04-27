"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  DollarSign,
  ArrowDownLeft,
  ArrowUpRight,
  RotateCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, formatDate } from "date-fns";

interface Transaction {
  id: string;
  amount: number;
  type: "earning" | "withdrawal" | "refund";
  status: "pending" | "completed" | "rejected";
  createdAt: string;
  referenceCode: string;
  currency: string;
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  earning: <DollarSign className="h-5 w-5 text-green-500" />,
  withdrawal: <ArrowDownLeft className="h-5 w-5 text-red-500" />,
  refund: <RotateCw className="h-5 w-5 text-yellow-500" />,
};

export function TransactionList({
  transactions,
  isLoading,
}: {
  transactions: Transaction[];
  isLoading: boolean;
}) {
  const [page, setPage] = useState(1);
  const [perPage] = useState(5);
  const [filterType, setFilterType] = useState<string | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const filtered = useMemo(() => {
    let list = transactions;

    if (filterType !== "all") {
      list = list.filter((tx) => tx.type === filterType);
    }

    if (searchQuery.trim()) {
      list = list.filter((tx) =>
        tx.referenceCode.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    list = list.sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? bTime - aTime : aTime - bTime;
    });

    return list;
  }, [transactions, filterType, searchQuery, sortOrder]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const currentData = filtered.slice((page - 1) * perPage, page * perPage);

  const groupedByMonth = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    for (const tx of currentData) {
      const month = format(new Date(tx.createdAt), "MMMM yyyy");
      if (!groups[month]) groups[month] = [];
      groups[month].push(tx);
    }
    return groups;
  }, [currentData]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Transactions</h2>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <Input
          placeholder="Search by Reference Code"
          className="w-[220px]"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
        />

        <Select
          value={filterType}
          onValueChange={(v) => {
            setFilterType(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Filter Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="earning">Earning</SelectItem>
            <SelectItem value="withdrawal">Withdrawal</SelectItem>
            {/* <SelectItem value="refund">Refund</SelectItem> */}
          </SelectContent>
        </Select>

        <Select
          value={sortOrder}
          onValueChange={(v) => {
            setSortOrder(v as any);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Skeleton key={idx} className="h-16 rounded-md" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-500">No transactions found.</p>
      ) : (
        <div className="h-[500px] space-y-6 overflow-y-scroll">
          {Object.entries(groupedByMonth).map(([month, transactions]) => {
            const totalEarnings = transactions
              .filter(
                (tx) => tx.type === "earning" && tx.status === "completed",
              )
              .reduce((sum, tx) => sum + tx.amount, 0);

            const totalWithdrawals = transactions
              .filter(
                (tx) => tx.type === "withdrawal" && tx.status === "completed",
              )
              .reduce((sum, tx) => sum + tx.amount, 0);

            return (
              <div key={month} className="space-y-4">
                {/* Month heading */}
                <div className="flex items-center justify-between">
                  <h3 className="text-md font-semibold text-gray-600">
                    {month}
                  </h3>
                  <div className="text-xs text-gray-500">
                    +${totalEarnings.toFixed(2)} / -$
                    {totalWithdrawals.toFixed(2)}
                  </div>
                </div>

                {/* List items */}
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-3">
                      {TYPE_ICONS[tx.type]}
                      <div>
                        <div className="font-medium capitalize">{tx.type}</div>
                        <div className="text-xs text-gray-500">
                          {tx.referenceCode}
                        </div>
                      </div>{" "}
                      <div className="text-xs text-gray-500">
                        {formatDate(new Date(tx.createdAt), "dd/MM/yyyy hh:mm")}
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={cn(
                          "font-bold",
                          tx.type === "earning" && "text-green-600",
                          tx.type === "withdrawal" && "text-red-600",
                          tx.type === "refund" && "text-yellow-600",
                        )}
                      >
                        {tx.type === "withdrawal" ? "-" : "+"}$
                        {tx.amount.toFixed(2)}
                      </div>
                      <Badge
                        variant={
                          tx.status === "completed" ? "default" : "outline"
                        }
                      >
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm">
            Page {page} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
