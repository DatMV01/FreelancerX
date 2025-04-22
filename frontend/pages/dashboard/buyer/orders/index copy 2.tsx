"use client";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderDetailDialog } from "@/features/order/components/OrderDetailDialog";
import OrderStatsDashboard from "@/features/order/components/OrderStatsDashboard";
import { OrderStatus, orderStatus } from "@/features/order/dto";
import { fetchFreelancersOrders } from "@/features/order/fakeApi";
import { CircularProgress } from "@mui/material";
import clsx from "clsx";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  ArrowUpDown,
  BadgeCheck,
  Ban,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  CircleArrowUp,
  Clock,
  CreditCard,
  Download,
  Eye,
  FileDown,
  MessageSquare,
  XCircle,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import React, { ReactElement, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import * as XLSX from "xlsx";
import { CheckCircle, Hammer, Package, RefreshCw } from "lucide-react";
import { fetchBuyerOrders } from "@/features/order/order.api";
import { useFilterParams } from "@/hooks/useUrlSync ";
import { saveAs } from "file-saver";
import { addDays, format, formatDate, set } from "date-fns";
import { OrderBuyerStatusButton } from "@/features/order/components/OrderBuyerStatusButton";
import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";

export const statusMap = {
  UNPAID: {
    label: "Unpaid",
    color: "bg-orange-100 text-orange-800",
    icon: <CreditCard className="text-orange-500" />,
  },
  PENDING: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
    icon: <Clock className="text-yellow-500" />,
  },
  ACCEPTED: {
    label: "Accepted",
    color: "bg-green-100 text-green-800",
    icon: <CheckCircle className="text-green-500" />,
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "bg-blue-100 text-blue-800",
    icon: <Hammer className="text-blue-500" />,
  },
  REVISION_REQUESTED: {
    label: "Revision Requested",
    color: "bg-purple-100 text-purple-800",
    icon: <RefreshCw className="text-purple-500" />,
  },
  DELIVERED: {
    label: "Delivered",
    color: "bg-indigo-100 text-indigo-800",
    icon: <Package className="text-indigo-500" />,
  },
  COMPLETED: {
    label: "Completed",
    color: "bg-emerald-100 text-emerald-800",
    icon: <BadgeCheck className="text-emerald-500" />,
  },

  CANCEL: {
    label: "Cancel",
    color: "bg-red-100 text-red-800",
    icon: <Ban className="text-red-500" />,
  },
};

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

  const [goToPage, setGoToPage] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [deletingRows, setDeletingRows] = useState<string[]>([]);
  const [showDeleteSelectedIdsDialog, setShowDeleteSelectedIdsDialog] =
    useState(false);

  const [selectedId, setSelectedId] = useState<string>();

  const [showDeleteSelectedIdDialog, setShowDeleteSelectedIdDialog] =
    useState(false);

  const [processingId, setProcessingId] = useState<string>();

  const page = filters.page || 1;
  const limit = filters.pageSize || 10;

  const [detailOpen, setDetailOpen] = useState(false);

  // const { data, isLoading, error } = useSWR("orders", fetchFreelancersOrders, {
  //   revalidateOnFocus: false,
  //   revalidateOnReconnect: false,
  //   refreshInterval: 0,
  // });

  const { data, isLoading, isValidating, error, mutate, key } = useOrders({
    page,
    limit,
    filters: `status:${filters.status?.toUpperCase()}`,
  });

  useEffect(() => {
    if (data) {
      setOrders(data.data as any);
    }

    console.log(data, "data");
  }, [data]);

  useEffect(() => {
    updateFilter({ page: 1 });
    setGoToPage("");
  }, [filters.status]);

  const filteredOrders = useMemo(() => {
    const { keyword, status } = filters;

    return orders.filter((order: any) => {
      console.log(order);
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

  const totalPages = Math.ceil(filteredOrders?.length / filters.pageSize);
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

  // const handleInputKeyDown = (e: any) => {
  //   if (e.key === "Enter") handleGoToPage();
  // };
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

  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * filters.pageSize,
    currentPage * filters.pageSize,
  );

  const getSortIcon = (key: string) => {
    if (sortConfig?.key !== key)
      return <ArrowUpDown className="inline h-4 w-4" />;
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    const idsOnPage = paginatedOrders.map((o) => o.id);
    const allSelected = idsOnPage.every((id) => selectedRows.includes(id));
    if (allSelected) {
      setSelectedRows((prev) => prev.filter((id) => !idsOnPage.includes(id)));
    } else {
      setSelectedRows((prev) => [...new Set([...prev, ...idsOnPage])]);
    }
  };

  const handleDeleteSelected = () => {
    // setDeletingRows(selectedRows);
    // setShowDeleteDialog(false);
    // setTimeout(() => {
    //   if (typeof setOrders === "function") {
    //     setOrders((prev) => prev.filter((o) => !selectedRows.includes(o.id)));
    //   }
    //   setSelectedRows([]);
    //   setDeletingRows([]);
    // }, 1000);
  };

  const [showCancelSelectedIdDialog, setShowCancelSelectedIdDialog] =
    useState(false);
  const handleCancelOrder = async () => {
    setProcessingId(selectedId || "");
    setShowCancelSelectedIdDialog(false);

    const response = await axiosInstanceV1.patch(`/orders/${selectedId}`, {
      status: OrderStatus.CANCEL,
      buyerId: "true",
    });

    if (response.status === 200) {
      setOrders((prev) => prev.filter((o) => o.id !== selectedId));
    }

    setSelectedId(undefined);
    setProcessingId(undefined);
  };

  const handleExportCSV = () => {
    const data = orders.map((_) => {
      return {
        title: _?.title,
        basicPrice: _?.basicPrice,

        standardPrice: _?.standardPrice,

        premiumPrice: _?.premiumPrice,

        status: statusMap[_?.status as keyof typeof statusMap].label,

        ratingAverate: _?.ratingAverate,
        views: _?.views,
        orderCount: _?.orderCount,
        createdAt: formatDate(new Date(_?.createdAt), "dd/MM/yyyy"),
        updatedAt: formatDate(new Date(_?.updatedAt), "dd/MM/yyyy"),
      };
    });
    const worksheet = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, "Earnings");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `gigs.xlsx`);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Thu nhập Freelancer", 14, 16);
    autoTable(doc, {
      head: [
        [
          "title",
          "basicPrice",
          "standardPrice",
          "premiumPrice",
          "status",
          "avgRating",
          "views",
          "orderCount",
          "createdAt",
          "updatedAt",
        ],
      ],
      bodyStyles: { fontSize: 10 },
      styles: { cellPadding: 2, fontSize: 8 },
      headStyles: { fillColor: "#00ff88", fontSize: 10 },
      margin: { top: 20 },

      body: orders.map((_: any) => [
        _?.title,
        _?.basicPrice,

        _?.standardPrice,

        _?.premiumPrice,

        statusMap[_?.status as keyof typeof statusMap].label,
        _?.avgRating,
        _?.views,
        _?.orderCount,
        formatDate(new Date(_?.createdAt), "dd/MM/yyyy"),
        formatDate(new Date(_?.updatedAt), "dd/MM/yyyy"),
      ]),
    });
    doc.save(`orders.pdf`);
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  if (error) return <div>Failed to load data.</div>;

  return (
    <div className="flex flex-col space-y-6">
      <h1 className="text-2xl font-bold">Manage Order</h1>

      <OrderStatsDashboard
        orders={orders}
        requiredStatus={[
          OrderStatus.UNPAID,
          OrderStatus.PENDING,
          //   OrderStatus.ACCEPTED,
          OrderStatus.IN_PROGRESS,
          // OrderStatus.REVISION_REQUESTED,
          OrderStatus.DELIVERED,
          OrderStatus.COMPLETED,
          OrderStatus.CANCEL,
        ]}
      />

      {/* <OrderChart /> */}

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
                {orderStatus.map((_) => (
                  <option key={_} value={_}>
                    {_}
                  </option>
                ))}
              </select>
              {/* 
              <Button variant="outline" onClick={handleExportCSV}>
                <Download className="mr-1 h-4 w-4" /> Export CSV
              </Button>

              <Button variant="outline" onClick={handleExportPDF}>
                <FileDown className="mr-2 h-4 w-4" />
                Export PDF
              </Button> */}
              {/* <AdvancedSearchDialog /> */}
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                {/* <TableHead>
                  <input
                    type="checkbox"
                    onChange={toggleSelectAll}
                    checked={
                      paginatedOrders.length > 0 &&
                      paginatedOrders.every((o) => selectedRows.includes(o.id))
                    }
                  />
                </TableHead> */}
                <TableHead>#</TableHead>
                <TableHead
                  onClick={() => handleSort("buyerName")}
                  className="cursor-pointer"
                >
                  Freelancer {getSortIcon("buyerName")}
                </TableHead>
                <TableHead
                  onClick={() => handleSort("gigTitle")}
                  className="cursor-pointer"
                >
                  Gig {getSortIcon("gigTitle")}
                </TableHead>
                <TableHead
                  onClick={() => handleSort("snapshot.title")}
                  className="cursor-pointer"
                >
                  Package {getSortIcon("snapshot.title")}
                </TableHead>
                <TableHead
                  onClick={() => handleSort("status")}
                  className="cursor-pointer"
                >
                  Status {getSortIcon("status")}
                </TableHead>
                <TableHead
                  onClick={() => handleSort("deadline")}
                  className="cursor-pointer"
                >
                  Start Date {getSortIcon("deadline")}
                </TableHead>
                <TableHead
                  onClick={() => handleSort("deadline")}
                  className="cursor-pointer"
                >
                  End Date {getSortIcon("deadline")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.map((_, index) => (
                <React.Fragment key={_.id}>
                  {/* Information */}
                  <TableRow
                    className={clsx(
                      "w-fit",
                      deletingRows.includes(_.id) &&
                        "pointer-events-none opacity-50",
                    )}
                  >
                    {/* <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(_.id)}
                        onChange={() => toggleSelectRow(_.id)}
                      />
                    </TableCell> */}

                    <TableCell>
                      {(currentPage - 1) * filters.pageSize + index + 1}
                    </TableCell>

                    <TableCell>{_.snapshot.freelancer.displayName}</TableCell>

                    <TableCell>{_.snapshot.gig.title}</TableCell>

                    <TableCell>
                      {`${_.snapshot.package.title} - ${_.snapshot.package.type.toUpperCase()}`}
                    </TableCell>

                    <TableCell>
                      <Badge
                        className={
                          statusMap[_.status as keyof typeof statusMap].color
                        }
                      >
                        {statusMap[_.status as keyof typeof statusMap].icon}
                        {statusMap[_.status as keyof typeof statusMap].label}
                      </Badge>
                    </TableCell>
                    {_.startDate && (
                      <TableCell>
                        <div className="flex">
                          <CalendarCheck className="h-4 w-4" />

                          {format(_.startDate, "dd/MM/yyyy")}
                        </div>
                      </TableCell>
                    )}

                    {_.endDate && (
                      <TableCell>
                        <div className="flex">
                          <CalendarCheck className="h-4 w-4" />

                          {format(_.endDate, "dd/MM/yyyy")}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>

                  {/* Action */}
                  <TableRow
                    className={clsx(
                      "w-fit",
                      (deletingRows.includes(_.id) || processingId === _.id) &&
                        "pointer-events-none opacity-50",
                    )}
                  >
                    <TableCell colSpan={8} className="bg-gray-50 pl-10">
                      <OrderBuyerStatusButton
                        status={_.status}
                        onPay={() => {
                          window.open(
                            `/payment/checkout${_.snapshot.paymentUrl}`,
                            "_blank",
                          );
                        }}
                        onCancel={() => {
                          setSelectedId(_.id);
                          setShowCancelSelectedIdDialog(true);
                        }}
                        onAccept={() => {}}
                        onRequestRevision={() => {}}
                        onDownload={() => {}}
                        onViewDetails={() => {
                          setSelectedId(_.id);
                          setDetailOpen(true);
                        }}
                        onRate={() => {}}
                      />
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>

          {selectedRows.length > 0 && (
            <div className="mt-4">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteSelectedIdsDialog(true)}
              >
                Delete {selectedRows.length} item
              </Button>
            </div>
          )}

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

      <OrderDetailDialog
        open={detailOpen}
        orderId={selectedId}
        onClose={() => setDetailOpen(false)}
      />

      <Dialog
        open={showCancelSelectedIdDialog}
        onOpenChange={setShowCancelSelectedIdDialog}
      >
        <DialogContent>
          <DialogHeader>
            Are you sure you want to cancel this order?
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowCancelSelectedIdDialog(false)}
            >
              Cancel
            </Button>
            <button
              className="rounded-sm border border-green-500 bg-white px-2 py-1 whitespace-nowrap text-green-500"
              onClick={handleCancelOrder}
            >
              Confirm Cancel
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

BuyerOrderPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default BuyerOrderPage;
