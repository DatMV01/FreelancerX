"use client";

import CircularProgressCenter from "@/components/CircularProgressCenter";
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
import {
  DashboardMainContent,
  DashboardMainContentHeader,
} from "@/features/dashboard/components/DashboardMainContent";
import OrderStats from "@/features/order/components/OrderStats";
import { OrderStatusBadge } from "@/features/order/components/OrderStatusBadge";
import {
  ActorType,
  orderFreelancerStatus,
  orderStatus,
  OrderStatus,
} from "@/features/order/dto";
import { useQuerySync } from "@/hooks/useQuerySync";
import { format, formatDate } from "date-fns";
import { saveAs } from "file-saver";
import {
  ArrowUpDown,
  Eye,
  RefreshCcw
} from "lucide-react";
import { VisuallyHidden } from "radix-ui";
import React, { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { OrderTypeBadge } from "../components/OrderTypeBadge";
import { defaulFetchOrdersByAdminQuery } from "../hooks/useGetOrdersByAdmin";
import { OrderEntity } from "../order.entity";
import { OrderDetail } from "./OrderDetail";

const TableHeaderSection = ({
  handleSort,
  getSortIcon,
  actorType = ActorType.ADMIN,
}: {
  handleSort: any;
  getSortIcon: any;
  actorType?: ActorType;
}) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>#</TableHead>

        <TableHead className="cursor-pointer">Order No</TableHead>

        {actorType === ActorType.ADMIN && (
          <>
            <TableHead
              onClick={() => handleSort("snapshot.freelancer.displayName")}
              className="cursor-pointer"
            >
              Freelancer {getSortIcon("snapshot.freelancer.displayName")}
            </TableHead>

            <TableHead
              onClick={() => handleSort("snapshot.buyer.fullName")}
              className="cursor-pointer"
            >
              Buyer {getSortIcon("snapshot.buyer.fullName")}
            </TableHead>
          </>
        )}

        {actorType === ActorType.BUYER && (
          <TableHead
            onClick={() => handleSort("snapshot.freelancer.displayName")}
            className="cursor-pointer"
          >
            Freelancer {getSortIcon("snapshot.freelancer.displayName")}
          </TableHead>
        )}

        {actorType === ActorType.FREELANCER && (
          <TableHead
            onClick={() => handleSort("snapshot.buyer.fullName")}
            className="cursor-pointer"
          >
            Buyer {getSortIcon("snapshot.buyer.fullName")}
          </TableHead>
        )}

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
  );
};

function OrdersManageTable({
  isLoading,
  error,
  response,
  mutate,
  actorType = ActorType.ADMIN,
}: {
  isLoading: boolean;
  error: any;
  response: any;
  mutate: any;
  actorType?: ActorType;
}) {
  const [detailOpen, setDetailOpen] = useState(false);
  const [pagingMetadata, setPagingMetadata] = useState<any>();
  const [selected, setSelected] = useState<OrderEntity | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const [orders, setOrders] = useState<any[]>([]);

  const { query, queryString, setQuery, resetQuery } =
    useQuerySync<OrderEntity>(defaulFetchOrdersByAdminQuery);

  const pageSize = Number(query?.pageSize);
  const page = Number(query?.page ?? 1);
  const totalItems = pagingMetadata?.itemCount ?? 1;

  useEffect(() => {
    if (response) {
      setOrders(response.data as any);
      setPagingMetadata(response.meta);
    }
  }, [response]);

  const filteredOrders = useMemo(() => {
    const { status } = query.filters ?? {};

    return orders.filter((order: any) => {
      //  const keyword = query.keyword ?? "";
      //  const matchesKeyword = keyword
      //    ? order.snapshot.gig.title.toLowerCase().includes(keyword.toLowerCase())
      //    : true;

      // const matchesStatus = status ? order.status === status : true;

      // const matchesFromDate = fromDate
      //   ? new Date(order.createdAt) >= new Date(fromDate)
      //   : true;

      // const matchesToDate = toDate
      //   ? new Date(order.createdAt) <= new Date(toDate)
      //   : true;

      return true;
      // matchesKeyword && matchesStatus && matchesFromDate && matchesToDate
    });
  }, [orders, query.filters]);

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

    if (key === "deadline") {
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

  if (error) return <div>Failed to load data.</div>;

  return (
    <DashboardMainContent>
      <DashboardMainContentHeader>
        <p>
          {actorType === ActorType.FREELANCER
            ? "Manage Tasks"
            : "Manage Orders"}
        </p>

        <Button
          variant="outline"
          onClick={() => {
            mutate();
          }}
        >
          <RefreshCcw />
        </Button>
      </DashboardMainContentHeader>

      {isLoading && <CircularProgressCenter />}

      {!isLoading && actorType === ActorType.ADMIN && (
        <OrderStats
          orders={orders}
          requiredStatus={[
            OrderStatus.UNPAID,
            OrderStatus.PENDING,
            OrderStatus.ACCEPTED,
            OrderStatus.PROGRESS,
            OrderStatus.DELIVERED,
            OrderStatus.REVISION,
            OrderStatus.COMPLETED,
            OrderStatus.CANCEL,
            OrderStatus.REFUND,
          ]}
        />
      )}

      {!isLoading && actorType === ActorType.BUYER && (
        <OrderStats
          orders={orders}
          requiredStatus={[
            OrderStatus.UNPAID,
            OrderStatus.PENDING,
            OrderStatus.ACCEPTED,
            OrderStatus.PROGRESS,
            OrderStatus.DELIVERED,
            OrderStatus.REVISION,
            OrderStatus.COMPLETED,
            OrderStatus.CANCEL,
            OrderStatus.REFUND,
          ]}
        />
      )}

      {!isLoading && actorType === ActorType.FREELANCER && (
        <OrderStats
          orders={orders}
          requiredStatus={[
            // OrderStatus.UNPAID,
            OrderStatus.PENDING,
            OrderStatus.ACCEPTED,
            OrderStatus.PROGRESS,
            OrderStatus.REVISION,
            OrderStatus.DELIVERED,
            OrderStatus.COMPLETED,
            OrderStatus.CANCEL,
            // OrderStatus.REFUND,
            // "TOTAL_ORDERS",
            // "TOTAL_REVENUE",
          ]}
        />
      )}

      {!isLoading && (
        <Card>
          <CardContent className="p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {/* <Input
               type="text"
               placeholder="Search by gig..."
               value={filters.keyword}
               onChange={(e) => {
                 updateFilter({ keyword: e.target.value });
               }}
               className="w-48"
             /> */}

                <select
                  value={query.filters?.status}
                  onChange={(e) => {
                    setQuery({
                      filters: {
                        status: e.target.value,
                      },
                      page: 1,
                    });
                  }}
                  className="rounded border px-2 py-1 text-sm"
                >
                  <option value="">All Statuses</option>
                  {actorType === ActorType.BUYER &&
                    orderStatus.map((_) => (
                      <option key={_} value={_}>
                        {_}
                      </option>
                    ))}

                  {actorType === ActorType.ADMIN &&
                    orderStatus.map((_) => (
                      <option key={_} value={_}>
                        {_}
                      </option>
                    ))}

                  {actorType === ActorType.FREELANCER &&
                    orderFreelancerStatus.map((_) => (
                      <option key={_} value={_}>
                        {_}
                      </option>
                    ))}
                </select>

                {/* <Button variant="outline" onClick={handleExportCSV}>
               <Download className="mr-1 h-4 w-4" /> Export CSV
             </Button> */}
              </div>
            </div>
            <Table>
              <TableHeaderSection
                handleSort={handleSort}
                getSortIcon={getSortIcon}
                actorType={actorType}
              />

              <TableBody>
                {sortedOrders.map((_, index) => (
                  <React.Fragment key={_.id}>
                    {/* Information */}
                    <TableRow className="w-fit">
                      <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>

                      <TableCell className="max-w-[200px] truncate">
                        {_.orderNo}
                      </TableCell>

                      {actorType === ActorType.ADMIN && (
                        <>
                          <TableCell className="max-w-[100px] truncate">
                            {_.snapshot.freelancer.displayName}
                          </TableCell>

                          <TableCell className="max-w-[100px] truncate">
                            {_.snapshot.buyer.fullName}
                          </TableCell>
                        </>
                      )}

                      {actorType === ActorType.BUYER && (
                        <TableCell className="max-w-[100px] truncate">
                          {_.snapshot.freelancer.displayName}
                        </TableCell>
                      )}

                      {actorType === ActorType.FREELANCER && (
                        <TableCell className="max-w-[100px] truncate">
                          {_.snapshot.buyer.fullName}
                        </TableCell>
                      )}

                      <TableCell className="max-w-[200px] truncate">
                        {_.snapshot.gig.title}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {_.snapshot.package.title}
                      </TableCell>

                      <TableCell>
                        <OrderTypeBadge
                          type={_.snapshot.package.type.toUpperCase()}
                        />
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
                            setSelected(_);
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
            <PaginationWithPageSize totalItems={totalItems} />;
            {/* <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
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
            </div> */}
          </CardContent>
        </Card>
      )}

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="flex h-[90vh] flex-col md:max-w-[90vw]">
          <VisuallyHidden.Root>
            <DialogHeader>DialogHeader</DialogHeader>
          </VisuallyHidden.Root>

          <OrderDetail
            actorType={actorType}
            orderId={selected?.id}
            mutateAllOrder={mutate}
          />
        </DialogContent>
      </Dialog>
    </DashboardMainContent>
  );
}

export default OrdersManageTable;
