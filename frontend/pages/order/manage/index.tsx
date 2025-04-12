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
import AdvancedSearchDialog, {
  Filters,
} from "@/features/order/components/AdvancedSearchDialog";
import { OrderActions } from "@/features/order/components/OrderActions";
import { OrderDetailDialog } from "@/features/order/components/OrderDetailDialog";
import OrderStatsDashboard from "@/features/order/components/OrderStatsDashboard";
import { StartOrderButton } from "@/features/order/components/StartOrderButton";
import { OrderStatus, orderStatus } from "@/features/order/dto";
import { fetchOrders } from "@/features/order/fakeApi";
import { CircularProgress } from "@mui/material";
import clsx from "clsx";
import {
  ArrowUpDown,
  BadgeCheck,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Download,
  Eye,
  Loader2,
  RotateCcw,
  Truck,
  XCircle,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

export const statusMap = {
  PENDING: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
    icon: <Clock className="text-yellow-500" />,
  },
  PAID: {
    label: "Paid",
    color: "bg-indigo-100 text-indigo-800",
    icon: <DollarSign className="text-indigo-500" />,
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "bg-blue-100 text-blue-800",
    icon: <Loader2 className="animate-spin text-blue-500" />,
  },
  DELIVERED: {
    label: "Delivered",
    color: "bg-green-100 text-green-800",
    icon: <Truck className="text-green-500" />,
  },
  COMPLETED: {
    label: "Completed",
    color: "bg-emerald-100 text-emerald-800",
    icon: <BadgeCheck className="text-emerald-500" />,
  },
  CANCELED: {
    label: "Canceled",
    color: "bg-red-100 text-red-800",
    icon: <XCircle className="text-red-500" />,
  },
  REFUNDED: {
    label: "Refunded",
    color: "bg-gray-100 text-gray-800",
    icon: <RotateCcw className="text-gray-500" />,
  },
};

export default function FreelancerOrderDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [orders, setOrders] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1"),
  );
  const [pageSize, setPageSize] = useState(
    parseInt(searchParams.get("pageSize") || "10"),
  );
  const [goToPage, setGoToPage] = useState("1");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingRows, setDeletingRows] = useState<string[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const { data, isLoading, error } = useSWR("orders", fetchOrders, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
  });

  useEffect(() => {
    if (data) {
      setOrders(data as any);
    }
  }, [data]);

  const keyword = searchParams.get("keyword") || "";
  const status = searchParams.get("status") || "";
  const fromDate = searchParams.get("from") || "";
  const toDate = searchParams.get("to") || "";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (filterStatus) params.set("status", filterStatus);
    else params.delete("status");

    params.set("page", currentPage.toString());
    params.set("pageSize", pageSize.toString());
    params.set("keyword", searchQuery);

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl, undefined, { scroll: false });
  }, [filterStatus, currentPage, pageSize, searchQuery]);

  const filteredOrders = useMemo(() => {
    return orders.filter(
      (order: {
        id: string;
        client: string;
        package: string;
        status: keyof typeof statusMap;
        createdAt: string;
        deadline: string;
      }) => {
        console.log(order);
        const matchesKeyword = keyword
          ? order.client.toLowerCase().includes(keyword.toLowerCase()) ||
            order.package.toLowerCase().includes(keyword.toLowerCase())
          : true;

        const matchesStatus = status ? order.status === status : true;

        const matchesFromDate = fromDate
          ? new Date(order.createdAt) >= new Date(fromDate)
          : true;

        const matchesToDate = toDate
          ? new Date(order.createdAt) <= new Date(toDate)
          : true;

        return (
          matchesKeyword && matchesStatus && matchesFromDate && matchesToDate
        );
      },
    );
  }, [orders, keyword, status, fromDate, toDate]);

  const totalPages = Math.ceil(filteredOrders?.length / pageSize);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const handleGoToPage = () => {
    const pageNum = parseInt(goToPage);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      //    setGoToPage("");
    }
  };

  const handleInputKeyDown = (e: any) => {
    if (e.key === "Enter") handleGoToPage();
  };

  const handleSort = (key: string) => {
    setCurrentPage(1);
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
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
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
    setDeletingRows(selectedRows);
    setShowDeleteDialog(false);

    setTimeout(() => {
      if (typeof setOrders === "function") {
        setOrders((prev) => prev.filter((o) => !selectedRows.includes(o.id)));
      }
      setSelectedRows([]);
      setDeletingRows([]);
    }, 1000); // 5 seconds delay
  };

  const handleExportCSV = () => {
    const header = "STT,Khách hàng,Dịch vụ,Trạng thái,Deadline\n";
    const rows = filteredOrders?.map(
      (order, index) =>
        `${index + 1},${order.client},${order.package},${statusMap[order.status as keyof typeof statusMap].label},${order.deadline}`,
    );
    const csvContent = header + rows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "orders.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [status]);

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

      <OrderStatsDashboard orders={orders} />

      {/* <OrderChart /> */}

      <Card>
        <CardContent className="p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Search by client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded border px-2 py-1 text-sm"
              >
                <option value="">All Statuses</option>
                {orderStatus.map((_) => (
                  <option value={_}>{_}</option>
                ))}
              </select>

              <Button variant="outline" onClick={handleExportCSV} size="sm">
                <Download className="mr-1 h-4 w-4" /> Export CSV
              </Button>

              <AdvancedSearchDialog />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <input
                    type="checkbox"
                    onChange={toggleSelectAll}
                    checked={
                      paginatedOrders.length > 0 &&
                      paginatedOrders.every((o) => selectedRows.includes(o.id))
                    }
                  />
                </TableHead>
                <TableHead>#</TableHead>
                <TableHead
                  onClick={() => handleSort("buyerName")}
                  className="cursor-pointer"
                >
                  Buyer {getSortIcon("buyerName")}
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
                  Deadline {getSortIcon("deadline")}
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.map((order, index) => (
                <TableRow
                  key={order.id}
                  className={clsx(
                    "w-fit",
                    deletingRows.includes(order.id) &&
                      "pointer-events-none opacity-50",
                  )}
                >
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(order.id)}
                      onChange={() => toggleSelectRow(order.id)}
                    />
                  </TableCell>

                  <TableCell>
                    {(currentPage - 1) * pageSize + index + 1}
                  </TableCell>

                  <TableCell>{order.buyerName}</TableCell>

                  <TableCell>{order.gigTitle}</TableCell>

                  <TableCell>
                    {order.snapshot.title} - {order.snapshot.type}
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={
                        statusMap[order.status as keyof typeof statusMap].color
                      }
                    >
                      {statusMap[order.status as keyof typeof statusMap].icon}
                      {statusMap[order.status as keyof typeof statusMap].label}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex">
                      <CalendarCheck className="h-4 w-4" />
                      {order.deadline}
                    </div>
                  </TableCell>

                  <TableCell className="space-x-2">
                    <div className="flex flex-wrap gap-2">
     
                      <OrderActions
                        onView={() => openOrderDetail(order)}
                        onDeliver={() => openDeliverModal(order)}
                        onCancel={() => cancelOrder(order)}
                        onMessage={() => openChat(order)}
                        onTag={() => openTagModal(order)}
                      />
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedOrderId(order.id);
                          setDetailOpen(true);
                        }}
                      >
                        <Eye className="mr-1 h-4 w-4" /> Detail
                      </Button>
                      <StartOrderButton
                        orderId={order.id}
                        currentStatus={order.status}
                      />
                      {(order.status === OrderStatus.PENDING ||
                        order.status === OrderStatus.IN_PROGRESS) && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();

                            toast.success("Đã lưu", {
                              description:
                                "Thông tin đơn hàng đã được cập nhật.",
                              duration: 3000,
                            });
                          }}
                        >
                          <XCircle className="mr-1 h-4 w-4" />
                          Yêu cầu hủy
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {selectedRows.length > 0 && (
            <div className="mt-4">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
              >
                Delete {selectedRows.length} item
              </Button>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
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
                Trang {currentPage} / {totalPages}
              </span>
              <Button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                size="icon"
                variant="outline"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>

              <span className="text-muted-foreground text-sm">
                Trang {currentPage} / {totalPages}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Trang..."
                value={goToPage}
                onChange={(e) => setGoToPage(e.target.value)}
                onKeyDown={handleInputKeyDown}
                className="w-24"
              />
              <Button size="sm" onClick={handleGoToPage}>
                Go to
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            Are you sure you want to delete the selected orders?
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSelected}>
              Confirm delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <OrderDetailDialog
        open={detailOpen}
        orderId={selectedOrderId}
        onClose={() => setDetailOpen(false)}
      />
    </div>
  );
}
