import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CalendarCheck,
  XCircle,
  Eye,
  ArrowUpDown,
  Download,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  Clock,
  Loader2,
  Truck,
  DollarSign,
  RotateCcw,
  Search,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import useSWR from "swr";
import { CircularProgress, DialogTitle } from "@mui/material";
import CircularProgressCenter from "@/components/CircularProgressCenter";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Select } from "@radix-ui/react-select";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const statusMap = {
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

const statuses = [
  "PENDING",
  "PAID",
  "IN_PROGRESS",
  "DELIVERED",
  "COMPLETED",
  "CANCELED",
  "REFUNDED",
];

const generateSampleOrders = (count = 100) => {
  const clients = [
    "Nguyễn Văn",
    "Trần Thị",
    "Lê Văn",
    "Phạm Thị",
    "Ngô Văn",
    "Vũ Thị",
    "Đặng Văn",
    "Hoàng Thị",
    "Bùi Văn",
    "Đỗ Thị",
  ];
  const packages = [
    "Professional Logo Design",
    "Document Translation",
    "Ad Banner Design",
    "Video Editing",
    "UX/UI App Design",
    "SEO Consulting",
    "Website Design",
    "Social Media Management",
    "Mobile App Development",
    "Brochure Design",
  ];

  const orders = [];

  for (let i = 1; i <= count; i++) {
    const client = `${clients[Math.floor(Math.random() * clients.length)]} ${String.fromCharCode(65 + (i % 26))}`;
    const packageName = packages[Math.floor(Math.random() * packages.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const deadline = new Date(
      Date.now() + Math.floor(Math.random() * 30) * 86400000,
    )
      .toISOString()
      .split("T")[0];

    orders.push({
      id: i,
      client,
      package: packageName,
      status,
      deadline,
    });
  }

  return orders;
};

export const fetchOrders = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const orders = generateSampleOrders(300);

      resolve(orders);
    }, 1500);
  });
};

export const fetchOrderById = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        client: `Nguyễn Văn ${id}`,
        package: "Professional Logo Design",
        status: "IN_PROGRESS",
        deadline: "2025-04-30",
        description: "Thiết kế logo cao cấp với concept độc đáo.",
        attachments: [],
        tags: ["Thiết kế", "Logo"],
      });
    }, 1000);
  });
};

export default function FreelancerOrderDashboard() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [goToPage, setGoToPage] = useState();
  const [sortConfig, setSortConfig] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingRows, setDeletingRows] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

const [open, setOpen ] = useState(false)

  const { data, isLoading, error } = useSWR("orders", fetchOrders);

  const {
    data: selectedOrder,
    isLoading: isLoadingOrderDetail,
    error: errorOrderDetail,
  } = useSWR(
    selectedOrderId ? [`order-${selectedOrderId}`, selectedOrderId] : null,
    (_, id) => fetchOrderById(id),
  );

  useEffect(() => {
    if (data) {
      setOrders(data);
    }
  }, [data]);

  const openDetailModal = (id) => {
    setSelectedOrderId(id);
    setDetailOpen(true);
  };
 


  const [filters, setFilters] = useState({
    keyword: '',
    fromDate: '',
    toDate: '',
    minPrice: '',
    maxPrice: '',
    status: '',
  });
  
const filteredOrders = useMemo(() => {
  if (!orders) return [];

  return orders.filter((order) => {
    const matchesKeyword =
      !filters.keyword ||
      order.customerName?.toLowerCase().includes(filters.keyword.toLowerCase()) ||
      order.code?.toLowerCase().includes(filters.keyword.toLowerCase()) ||
      order.description?.toLowerCase().includes(filters.keyword.toLowerCase());

    const createdAt = new Date(order.createdAt);
    const fromDate = filters.fromDate ? new Date(filters.fromDate) : null;
    const toDate = filters.toDate ? new Date(filters.toDate) : null;
    const matchesDate =
      (!fromDate || createdAt >= fromDate) &&
      (!toDate || createdAt <= toDate);

    const matchesPrice =
      (!filters.minPrice || order.price >= parseFloat(filters.minPrice)) &&
      (!filters.maxPrice || order.price <= parseFloat(filters.maxPrice));

    const matchesStatus =
      !filters.status || order.status === filters.status;

    return matchesKeyword && matchesDate && matchesPrice && matchesStatus;
  });
}, [orders, filters]);

  // const filteredOrders = orders.filter((order) => {
  //   const matchesSearch = order?.client
  //     .toLowerCase()
  //     .includes(searchQuery.toLowerCase());
  //   const matchesStatus = filterStatus ? order.status === filterStatus : true;
  //   return matchesSearch && matchesStatus;
  // });

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
      setGoToPage("");
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") handleGoToPage();
  };

  const handleSort = (key) => {
    setCurrentPage(1);
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      } else {
        return { key, direction: "asc" };
      }
    });
  };

  
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    const aVal = a[key];
    const bVal = b[key];

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

  const getSortIcon = (key) => {
    if (sortConfig?.key !== key)
      return <ArrowUpDown className="inline h-4 w-4" />;
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  const toggleSelectRow = (id) => {
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

    // Simulate delay for user effect
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
        `${index + 1},${order.client},${order.package},${statusMap[order.status].label},${order.deadline}`,
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

  const router = useRouter();
  const initialStatus = router.query.status || "all";
  const searchParams = useSearchParams();

  // Đọc từ URL query khi load trang
  useEffect(() => {
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const size = parseInt(searchParams.get("pageSize") || "10");

    if (status && statuses.includes(status)) setFilterStatus(status);
    if (!isNaN(page)) setCurrentPage(page);
    if (!isNaN(size)) setPageSize(size);
  }, [searchParams]);

  // Update URL khi thay đổi filter/page/pageSize
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (filterStatus) params.set("status", filterStatus);
    else params.delete("status");

    params.set("page", currentPage.toString());
    params.set("pageSize", pageSize.toString());

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl);
  }, [filterStatus, currentPage, pageSize]);

  // // Reset page về 1 khi đổi filter
  // useEffect(() => {
  //   setCurrentPage(1)
  // }, [filterStatus])

  const stats = useMemo(() => {
    if (!orders) return null;

    const statusCount = orders.reduce(
      (acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const totalRevenue = orders
      .filter((o) => o.status === "completed")
      .reduce((sum, o) => sum + o.price, 0);

    const revenueByMonth = orders.reduce(
      (acc, order) => {
        if (order.status !== "completed") return acc;

        const date = new Date(order.createdAt);
        const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
        acc[key] = (acc[key] || 0) + order.price;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      statusCount,
      totalRevenue,
      revenueByMonth,
    };
  }, [orders]);

  /* Bieu do tron */

  const pieData = Object.entries(stats?.statusCount || {}).map(
    ([status, count]) => ({
      name: status,
      value: count,
    }),
  );

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50"];

  /* Bieu do cot */
  const barData = Object.entries(stats?.revenueByMonth || {}).map(
    ([month, revenue]) => ({
      month,
      revenue,
    }),
  );















  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    // Cập nhật query URL để đồng bộ
    const params = new URLSearchParams();
  
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value.toString());
      }
    });
  
    // Push URL mới (Next.js App Router)
    router.push(`?${params.toString()}`, { scroll: false });
  
    // Optionally: đóng dialog
    setOpen(false);
  };



  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
  
    setFilters({
      keyword: params.get('keyword') || '',
      fromDate: params.get('fromDate') || '',
      toDate: params.get('toDate') || '',
      minPrice: params.get('minPrice') || '',
      maxPrice: params.get('maxPrice') || '',
      status: params.get('status') || '',
    });
  }, []);
  
 
const updateQueryParams = (filters: any) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value.toString());
  });

  router.push(`?${params.toString()}`, { scroll: false });
};





  if (isLoading) return <CircularProgress />;
  if (error) return <div>Failed to load data.</div>;

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Quản lý đơn hàng</h1>

      <PieChart width={300} height={300}>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          outerRadius={100}
          dataKey="value"
          label
        >
          {pieData.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={barData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="revenue" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      <Card>
        <CardContent className="grid grid-cols-2 gap-4 p-4">
          <div>
            <div className="text-muted-foreground text-sm">Tổng số đơn</div>
            <div className="text-2xl font-bold">{orders.length}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-sm">Tổng doanh thu</div>
            <div className="text-2xl font-bold">
              {stats?.totalRevenue.toLocaleString()}₫
            </div>
          </div>
        </CardContent>
      </Card>

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
                {statuses.map((_) => (
                  <option value={_}>{_}</option>
                ))}
              </select>
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
              <Button variant="outline" onClick={handleExportCSV} size="sm">
                <Download className="mr-1 h-4 w-4" /> Export CSV
              </Button>

              <Button onClick={() => setOpen(true)}>
  <Search className="w-4 h-4 mr-2" /> Tìm kiếm nâng cao
</Button>
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
                  onClick={() => handleSort("client")}
                  className="cursor-pointer"
                >
                  Khách hàng {getSortIcon("client")}
                </TableHead>
                <TableHead
                  onClick={() => handleSort("package")}
                  className="cursor-pointer"
                >
                  Dịch vụ {getSortIcon("package")}
                </TableHead>
                <TableHead
                  onClick={() => handleSort("status")}
                  className="cursor-pointer"
                >
                  Trạng thái {getSortIcon("status")}
                </TableHead>
                <TableHead
                  onClick={() => handleSort("deadline")}
                  className="cursor-pointer"
                >
                  Deadline {getSortIcon("deadline")}
                </TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.map((order, index) => (
                <TableRow
                  key={order.id}
                  className={
                    deletingRows.includes(order.id)
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
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
                  <TableCell>{order.client}</TableCell>
                  <TableCell>{order.package}</TableCell>
                  <TableCell>
                    <Badge className={statusMap[order.status].color}>
                      {statusMap[order.status].icon}
                      {statusMap[order.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <CalendarCheck className="h-4 w-4" />
                    {order.deadline}
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDetailModal(order)}
                    >
                      <Eye className="mr-1 h-4 w-4" /> Xem
                    </Button>
                    {order.status === "pending" && (
                      <Button size="sm">Bắt đầu</Button>
                    )}
                    {(order.status === "in_progress" ||
                      order.status === "pending") && (
                      <Button variant="destructive" size="sm">
                        <XCircle className="mr-1 h-4 w-4" />
                        Yêu cầu hủy
                      </Button>
                    )}
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
                Xóa {selectedRows.length} đơn đã chọn
              </Button>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2">
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
                Đi đến
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            Bạn có chắc chắn muốn xóa các đơn đã chọn?
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteSelected}>
              Xác nhận xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>Chi tiết đơn hàng</DialogHeader>
          {isLoadingOrderDetail ? (
            <CircularProgress />
          ) : errorOrderDetail ? (
            <p className="text-red-500">Lỗi khi tải dữ liệu</p>
          ) : selectedOrder ? (
            <div className="space-y-2 text-sm">
              <p>
                <strong>Khách hàng:</strong> {selectedOrder.client}
              </p>
              <p>
                <strong>Dịch vụ:</strong> {selectedOrder.package}
              </p>
              <p>
                <strong>Trạng thái:</strong>{" "}
                {statusMap[selectedOrder.status].label}
              </p>
              <p>
                <strong>Deadline:</strong> {selectedOrder.deadline}
              </p>
              <p>
                <strong>Mô tả:</strong> {selectedOrder.description}
              </p>
              <div>
                <strong>Tags:</strong>{" "}
                {selectedOrder.tags.map((tag, i) => (
                  <Badge key={i} className="mr-1">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          ) : (
            <p>Không có dữ liệu</p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailOpen(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="sm:max-w-xl">
    <DialogHeader>
      <DialogTitle>Tìm kiếm nâng cao</DialogTitle>
    </DialogHeader>

    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <Input
          name="keyword"
          placeholder="Từ khóa (mã đơn, tên khách, mô tả...)"
          value={filters.keyword}
          onChange={e => setFilters(f => ({ ...f, keyword: e.target.value }))}
        />

        <div className="grid grid-cols-2 gap-2">
          <Input
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={e => setFilters(f => ({ ...f, fromDate: e.target.value }))}
          />
          <Input
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={e => setFilters(f => ({ ...f, toDate: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            name="minPrice"
            placeholder="Giá tối thiểu"
            value={filters.minPrice}
            onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))}
          />
          <Input
            type="number"
            name="maxPrice"
            placeholder="Giá tối đa"
            value={filters.maxPrice}
            onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
          />
        </div>

        <Select
          value={filters.status}
          onValueChange={(value) => setFilters(f => ({ ...f, status: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Trạng thái đơn hàng" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Đang chờ</SelectItem>
            <SelectItem value="completed">Hoàn thành</SelectItem>
            <SelectItem value="cancelled">Đã hủy</SelectItem>
          </SelectContent>
        </Select>

        {/* Nếu có tags: */}
        {/* <TagMultiSelect value={filters.tags} onChange={...} /> */}
      </div>

      <DialogFooter>
        <Button type="submit">Tìm kiếm</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>

    </div>
  );
}
