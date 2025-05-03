"use client";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Badge } from "@/components/ui/badge";
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
import OrderStats from "@/features/order/components/OrderStats";
import { orderFreelancerStatus, OrderStatus } from "@/features/order/dto";
import { CircularProgress } from "@mui/material";
import clsx from "clsx";

import OrderCancelDialog from "@/features/order/components/OrderCancelDialog";
import OrderDeliverWorkDialog from "@/features/order/components/OrderDeliverWorkDialog";
import { OrderDetailFreelancer } from "@/features/order/components/OrderDetailFreelancer";
import { OrderStatusButtonFreelancer } from "@/features/order/components/OrderStatusButtonFreelancer";
import StartWorkingDialog from "@/features/order/components/StartWorkingDialog";
import { fetchFreelancerOrders } from "@/features/order/order.api";
import { useFilterParams } from "@/hooks/useUrlSync ";
import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";
import { format, formatDate } from "date-fns";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  ArrowUpDown,
  BadgeCheck,
  Ban,
  CalendarCheck,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  Eye,
  Hammer,
  Package,
  RefreshCcw,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/router";
import { VisuallyHidden } from "radix-ui";
import React, { ReactElement, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import * as XLSX from "xlsx";
import { OrderStatusBadge } from "@/features/order/components/OrderStatusBadge";
import DashboardLayout2 from "@/components/layouts/DashboardLayout2";
import {
  DashboardMainContent,
  DashboardMainContentHeader,
} from "@/features/dashboard/components/DashboardMainContent";
import { toast } from "sonner";
import { ErrorOrEmptyState } from "@/components/ErrorOrEmptyState";
import CircularProgressCenter from "@/components/CircularProgressCenter";

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
    color: "bg-orange-100 text-orange-800",
    icon: <CheckCircle className="text-orange-500" />,
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
    () => fetchFreelancerOrders({ page, limit, filters }),
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

function FreelancerOrderPage() {
  const router = useRouter();

  const { filters, updateFilter, resetFilters } = useFilterParams();

  const [orders, setOrders] = useState<any[]>([]);
  const [pagingMetadata, setPagingMetadata] = useState<any>();

  const [goToPage, setGoToPage] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [deletingRows, setDeletingRows] = useState<string[]>([]);

  const [selectedId, setSelectedId] = useState<string>();

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
  const [showDialog, setShowDialog] = useState(false);

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

  const [openDeliver, setOpenDeliver] = useState(false);
  const [startWorkDialogOpen, setStartWorkDialogOpen] = useState(false);
  const [cancelOrderDialogOpen, setCancelOrderDialogOpen] = useState(false);

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

  if (isLoading || isValidating) {
    return <CircularProgressCenter />;
  }

  <ErrorOrEmptyState
    isError={!!error}
    isLoading={isLoading || isValidating}
    retry={() => mutate()}
  />;

  return (
    <DashboardMainContent>
      <DashboardMainContentHeader>
        <p>Manage Task</p>
        <Button
          variant="outline"
          onClick={() => {
            mutate();
          }}
        >
          <RefreshCcw />
        </Button>
      </DashboardMainContentHeader>

      <OrderStats
        orders={orders}
        requiredStatus={[
          // OrderStatus.UNPAID,
          OrderStatus.PENDING,
          OrderStatus.ACCEPTED,
          OrderStatus.IN_PROGRESS,
          OrderStatus.REVISION_REQUESTED,
          OrderStatus.DELIVERED,
          OrderStatus.COMPLETED,
          OrderStatus.CANCEL,
          // OrderStatus.REFUND,
          // "TOTAL_ORDERS",
          // "TOTAL_REVENUE",
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
                {orderFreelancerStatus.map((_) => (
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

                <TableHead className="cursor-pointer">Order</TableHead>

                <TableHead
                  onClick={() => handleSort("snapshot.buyer.fullName")}
                  className="cursor-pointer"
                >
                  Buyer {getSortIcon("snapshot.buyer.fullName")}
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

                    <TableCell>{_.id.split("-")[4]}</TableCell>

                    <TableCell>{_.snapshot.buyer.fullName}</TableCell>

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
                  <TableRow
                    className={clsx(
                      "w-fit",
                      (deletingRows.includes(_.id) || processingId === _.id) &&
                        "pointer-events-none opacity-50",
                    )}
                  >
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

          <OrderDetailFreelancer orderId={selectedId} mutateAllOrder={mutate} />
        </DialogContent>
      </Dialog>

      <OrderDeliverWorkDialog
        open={openDeliver}
        onOpenChange={setOpenDeliver}
        onSubmit={async ({ message, file }) => {
          console.log(message);
          console.log(file);

          const orderId = selectedId;

          const formData = new FormData();
          formData.append("message", message);
          if (orderId) {
            formData.append("orderId", orderId);
          } else {
            console.error("Order ID is undefined");
          }

          if (file) {
            const newFileName = `order___${orderId}___${file.name.replaceAll(" ", "_")}`;
            const newFile = new File([file], newFileName, {
              type: file.type,
            });

            const fileForm = new FormData();
            fileForm.append("file", newFile);

            const { data, status } = await axiosInstanceV1.post(
              "/file/upload",
              fileForm,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              },
            );

            if (status === 201) {
              console.log("File uploaded successfully", data);
              formData.append("file", JSON.stringify(data));
            }
          }
          console.log(formData);

          const { data, status } = await axiosInstanceV1.post(
            `/orders/delivery`,
            formData,
          );

          if (status === 201) {
            mutate();
          }

          setOpenDeliver(false);
        }}
      />

      <StartWorkingDialog
        open={startWorkDialogOpen}
        onOpenChange={setStartWorkDialogOpen}
        handleStartWorkOrder={async () => {
          setProcessingId(selectedId);

          const response = await axiosInstanceV1.patch(
            `/orders/${selectedId}`,
            {
              status: OrderStatus.IN_PROGRESS,
            },
          );

          if (response.status === 200) {
            //setOrders((prev) => prev.filter((o) => o.id !== selectedId));
            mutate();
          }

          setStartWorkDialogOpen(false);
          setSelectedId(undefined);
          setProcessingId(undefined);
        }}
      />

      <OrderCancelDialog
        open={cancelOrderDialogOpen}
        onOpenChange={setCancelOrderDialogOpen}
        handleCancelOrder={async () => {
          setProcessingId(selectedId);

          const response = await axiosInstanceV1.patch(
            `/orders/${selectedId}`,
            {
              status: OrderStatus.CANCEL,
            },
          );

          if (response.status === 200) {
            //   setOrders((prev) => prev.filter((o) => o.id !== selectedId));
            mutate();
          }

          setCancelOrderDialogOpen(false);
          setSelectedId(undefined);
          setProcessingId(undefined);
        }}
      />
    </DashboardMainContent>
  );
}

FreelancerOrderPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout2>{page}</DashboardLayout2>;
};

export default FreelancerOrderPage;
