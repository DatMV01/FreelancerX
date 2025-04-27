"use client";

import CircularProgressCenter from "@/components/CircularProgressCenter";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderDetailBuyer } from "@/features/order/components/OrderDetailBuyer";
import OrderStats from "@/features/order/components/OrderStats";
import { OrderStatusBadge } from "@/features/order/components/OrderStatusBadge";
import { orderFreelancerStatus, OrderStatus } from "@/features/order/dto";
import {
  fetchBuyerOrders,
  fetchFreelancerOrders,
} from "@/features/order/order.api";
import { useFilterParams } from "@/hooks/useUrlSync ";
import { CircularProgress } from "@mui/material";
import { format, formatDate } from "date-fns";
import { saveAs } from "file-saver";
import {
  ArrowUpDown,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
} from "lucide-react";
import { useRouter } from "next/router";
import { VisuallyHidden } from "radix-ui";
import React, { ReactElement, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import * as XLSX from "xlsx";

const useOrders = ({
  page = 1,
  limit = 10,
  filters = "",
  config = {},
}: {
  page: number;
  limit: number;
  filters?: string;
  config?: any;
}) => {
  const key = filters
    ? [`/orders`, page, limit, filters]
    : [`/orders`, page, limit];

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    key,
    () => fetchBuyerOrders({ page, limit, filters }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
      refreshInterval: 0,
      ...config,
    },
  );
  return {
    data,
    isLoading,
    isValidating,
    mutate,
    error,
    key,
  };
};

function BuyerOrderPage() {
  const router = useRouter();

  const { filters, updateFilter, resetFilters } = useFilterParams();

  const [orders, setOrders] = useState<any[]>([]);
  const [pagingMetadata, setPagingMetadata] = useState<any>();

  const [goToPage, setGoToPage] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const [selectedId, setSelectedId] = useState<string>();

  const page = filters.page || 1;
  const limit = filters.pageSize || 10;

  const [detailOpen, setDetailOpen] = useState(false);

  const { data, isLoading, isValidating, error, mutate, key } = useOrders({
    page,
    limit,
    filters: `status:${filters.status?.toUpperCase()}`,
  });

  useEffect(() => {
    if (data) {
      setOrders(data.data as any);
      setPagingMetadata(data.meta);
    }
  }, [data]);

  useEffect(() => {
    updateFilter({ page: 1 });
    setGoToPage("");
  }, [filters.status]);

  const filteredOrders = useMemo(() => {
    const { keyword, status } = filters;

    return orders.filter((order: any) => {
      const matchesKeyword = keyword
        ? order.snapshot.gig.title.toLowerCase().includes(keyword.toLowerCase())
        : true;

      const matchesStatus = status ? order.status === status : true;

      // const matchesFromDate = fromDate
      //   ? new Date(order.createdAt) >= new Date(fromDate)
      //   : true;

      // const matchesToDate = toDate
      //   ? new Date(order.createdAt) <= new Date(toDate)
      //   : true;

      return (
        matchesKeyword && matchesStatus
        //&& matchesFromDate && matchesToDate
      );
    });
  }, [orders, filters]);

  //const totalPages = Math.ceil(filteredOrders?.length / filters.pageSize);
  const totalPages = pagingMetadata?.pageCount ?? 1;
  const currentPage = filters.page;

  const handleNext = () => {
    if (currentPage < totalPages) {
      updateFilter({ page: currentPage + 1 });
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) updateFilter({ page: currentPage - 1 });
  };

  const handleGoToPage = () => {
    const pageNum = Number(goToPage);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      updateFilter({ page: pageNum });
    }
  };

  const handleSort = (key: string) => {
    updateFilter({ page: 1 });

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

    if (key === "deadline") {
      return direction === "asc"
        ? new Date(aVal).getTime() - new Date(bVal).getTime()
        : new Date(bVal).getTime() - new Date(aVal).getTime();
    }

    return direction === "asc"
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  // const paginatedOrders = sortedOrders.slice(
  //   (currentPage - 1) * filters.pageSize,
  //   currentPage * filters.pageSize,
  // );

  const paginatedOrders = sortedOrders;

  const getSortIcon = (key: string) => {
    if (sortConfig?.key !== key)
      return <ArrowUpDown className="inline h-4 w-4" />;
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  const handleExportCSV = () => {
    const data = orders.map((_) => {
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

  if (isLoading) {
    return <CircularProgressCenter fullScreen />;
  }

  if (error) return <div>Failed to load data.</div>;

  return (
    <div className="flex flex-col space-y-6">
      <h1 className="rounded-md border border-green-500 p-4 text-center text-2xl font-bold text-green-500">
        Manage Order
      </h1>

      <OrderStats
        orders={orders}
        requiredStatus={[
          OrderStatus.UNPAID,
          OrderStatus.PENDING,
          OrderStatus.ACCEPTED,
          OrderStatus.IN_PROGRESS,
          OrderStatus.REVISION_REQUESTED,
          OrderStatus.DELIVERED,
          OrderStatus.COMPLETED,
          OrderStatus.CANCEL,
        ]}
      />

      <Card>
        <CardContent className="p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Input
                type="text"
                placeholder="Search by gig..."
                value={filters.keyword}
                onChange={(e) => {
                  updateFilter({ keyword: e.target.value });
                }}
                className="w-48"
              />
              <select
                value={filters.status}
                onChange={(e) => updateFilter({ status: e.target.value })}
                className="rounded border px-2 py-1 text-sm"
              >
                <option value="">All Statuses</option>
                {orderFreelancerStatus.map((_) => (
                  <option key={_} value={_}>
                    {_}
                  </option>
                ))}
              </select>

              <Button variant="outline" onClick={handleExportCSV}>
                <Download className="mr-1 h-4 w-4" /> Export CSV
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>

                <TableHead className="cursor-pointer">Order</TableHead>

                <TableHead
                  onClick={() => handleSort("snapshot.freelancer.displayName")}
                  className="cursor-pointer"
                >
                  Freelancer {getSortIcon("snapshot.freelancer.displayName")}
                </TableHead>

                <TableHead
                  onClick={() => handleSort("snapshot.gig.title")}
                  className="cursor-pointer"
                >
                  Gig {getSortIcon("snapshot.gig.title")}
                </TableHead>

                <TableHead
                  onClick={() => handleSort("snapshot.package.type")}
                  className="cursor-pointer"
                >
                  Package {getSortIcon("snapshot.package.title")}
                </TableHead>

                <TableHead
                  onClick={() => handleSort("snapshot.package.type")}
                  className="cursor-pointer"
                >
                  Type {getSortIcon("snapshot.package.type")}
                </TableHead>

                <TableHead
                  onClick={() => handleSort("status")}
                  className="cursor-pointer"
                >
                  Status {getSortIcon("status")}
                </TableHead>

                <TableHead
                  onClick={() => handleSort("createdAt")}
                  className="cursor-pointer"
                >
                  Create Date {getSortIcon("createdAt")}
                </TableHead>

                <TableHead
                  onClick={() => handleSort("startDate")}
                  className="cursor-pointer"
                >
                  Start Date {getSortIcon("startDate")}
                </TableHead>

                <TableHead
                  onClick={() => handleSort("endDate")}
                  className="cursor-pointer"
                >
                  Deadline {getSortIcon("endDate")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.map((_, index) => (
                <React.Fragment key={_.id}>
                  {/* Information */}
                  <TableRow className="w-fit">
                    <TableCell>
                      {(currentPage - 1) * filters.pageSize + index + 1}
                    </TableCell>

                    <TableCell>{_.id.split("-")[4]}</TableCell>

                    <TableCell>{_.snapshot.freelancer.displayName}</TableCell>

                    <TableCell>{_.snapshot.gig.title}</TableCell>

                    <TableCell>{_.snapshot.package.title}</TableCell>

                    <TableCell>
                      {_.snapshot.package.type.toUpperCase()}
                    </TableCell>

                    <TableCell>
                      <OrderStatusBadge status={_.status} />
                    </TableCell>

                    <TableCell>
                      <div className="flex">
                        {format(_.createdAt, "dd/MM/yyyy")}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex">
                        {_.startDate && format(_.startDate, "dd/MM/yyyy")}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex">
                        {_.endDate && format(_.endDate, "dd/MM/yyyy")}
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Action */}
                  <TableRow className="w-fit">
                    <TableCell colSpan={11} className="bg-gray-50 pl-10">
                      <Button
                        onClick={() => {
                          setSelectedId(_.id);
                          setDetailOpen(true);
                        }}
                        variant="outline"
                      >
                        <Eye className="h-4" /> View Details
                      </Button>

                      {/* <OrderFreelancerStatusButton
                        status={_.status}
                        onViewDetails={() => {
                          setSelectedId(_.id);
                          setDetailOpen(true);
                        }}
                        onAccept={() => {}}
                        onDecline={() => {}}
                        onStart={() => {
                          setSelectedId(_.id);
                          setStartWorkDialogOpen(true);
                        }}
                        onCancel={() => {
                          setSelectedId(_.id);
                          setCancelOrderDialogOpen(true);
                        }}
                        onDeliver={() => {
                          setSelectedId(_.id);
                          setOpenDeliver(true);
                        }}
                        onAskQuestion={() => {}}
                      /> */}
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <select
                value={filters.pageSize}
                onChange={(e) => {
                  e.preventDefault();
                  updateFilter({ page: 1 });
                  updateFilter({ pageSize: Number(e.target.value) });
                  setGoToPage("");
                }}
                className="rounded border px-2 py-1 text-sm"
              >
                {[10, 20, 30, 40, 50].map((num) => (
                  <option key={num} value={num}>
                    {num} per page
                  </option>
                ))}
              </select>
              <Button
                onClick={handlePrev}
                disabled={currentPage === 1}
                size="icon"
                variant="outline"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <span className="px-2 text-sm">
                Page {currentPage} / {totalPages}
              </span>
              <Button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                size="icon"
                variant="outline"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Page..."
                value={goToPage}
                onChange={(e) => setGoToPage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleGoToPage();
                }}
                min={1}
                max={totalPages}
                className="w-24"
              />
              <Button size="sm" onClick={handleGoToPage}>
                Go to
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="flex h-[90vh] flex-col md:max-w-[90vw]">
          <VisuallyHidden.Root>
            <DialogHeader>DialogHeader</DialogHeader>
          </VisuallyHidden.Root>

          <OrderDetailBuyer orderId={selectedId} mutateAllOrder={mutate} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

BuyerOrderPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default BuyerOrderPage;
