"use client";

import CircularProgressCenter from "@/components/CircularProgressCenter";
import PaginationWithPageSize from "@/components/PaginationWithPageSize";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
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
import { defaulFetchOrdersByAdminQuery } from "@/features/order/hooks/useGetOrdersByAdmin";
import { OrderEntity } from "@/features/order/order.entity";
import { useQuerySync } from "@/hooks/useQuerySync";
import { format, formatDate } from "date-fns";
import { saveAs } from "file-saver";
import {
  ArrowUpDown,
  Download,
  Eye,
  Loader2,
  PauseCircle,
  Pencil,
  RefreshCcw,
  Send,
  X,
} from "lucide-react";
import { VisuallyHidden } from "radix-ui";
import React, { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { defaulFetchGigsQuery } from "../hooks/useGetActiveGigs";
import { GigEntity } from "../gig.entity";
import { ErrorOrEmptyState } from "@/components/ErrorOrEmptyState";
import GigsStats from "./GigsStats";
import { GigStatus, gigStatus } from "../gig.types";
import { useRouter } from "next/router";
import { GigStatusBadge } from "./GigStatusBadge";
import clsx from "clsx";
import Link from "next/link";
import GigStatusButtonsFreelancer from "./GigStatusButtonsFreelancer";
import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";
import { deleteGig, updateGig } from "../gig.api";
import { toast } from "sonner";
import GigStatusButtonsAdmin from "./GigStatusButtonsAdmin";

function formatDate2(date?: string) {
  return date ? format(new Date(date), "dd/MM/yyyy HH:mm") : "";
}

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
        {/* <TableHead>
         <input
           type="checkbox"
           onChange={toggleSelectAll}
           checked={
             paginatedGigs.length > 0 &&
             paginatedGigs.every((o) => selectedRows.includes(o.id))
           }
         />
       </TableHead> */}
        <TableHead>#</TableHead>
        <TableHead
          onClick={() => handleSort("title")}
          className="cursor-pointer"
        >
          Title {getSortIcon("title")}
        </TableHead>

        {actorType === ActorType.ADMIN && (
          <TableHead
            onClick={() => handleSort("freelancer.email")}
            className="cursor-pointer"
          >
            Freelancer {getSortIcon("freelancer.email")}
          </TableHead>
        )}

        <TableHead
          onClick={() => handleSort("basicPrice")}
          className="flex cursor-pointer"
        >
          <p> Price {getSortIcon("basicPrice")}</p>
        </TableHead>

        <TableHead
          onClick={() => handleSort("status")}
          className="cursor-pointer"
        >
          Status {getSortIcon("status")}
        </TableHead>
        <TableHead
          onClick={() => handleSort("ratingAverage")}
          className="cursor-pointer"
        >
          Rating {getSortIcon("ratingAverage")}
        </TableHead>

        <TableHead
          onClick={() => handleSort("viewCount")}
          className="cursor-pointer"
        >
          Views {getSortIcon("viewCount")}
        </TableHead>

        <TableHead
          onClick={() => handleSort("orderCompleteCount")}
          className="cursor-pointer"
        >
          Orders {getSortIcon("orderCompleteCount")}
        </TableHead>

        <TableHead
          onClick={() => handleSort("favoriteCount")}
          className="cursor-pointer"
        >
          Favorites {getSortIcon("favoriteCount")}
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};

function GigsManageTable({
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
  const router = useRouter();
  const [deletingRows, setDeletingRows] = useState<string[]>([]);
  const [processingId, setProcessingId] = useState<string>();

  const [detailOpen, setDetailOpen] = useState(false);
  const [pagingMetadata, setPagingMetadata] = useState<any>();
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const [selectedId, setSelectedId] = useState<string>();
  const [showActiveDialog, setShowActiveDialog] = useState(false);
  const [showPauseGigDialog, setShowPausePauseGigDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const [processing, setProcessing] = useState(false);

  const [gigs, setGigs] = useState<any[]>([]);

  const { query, queryString, setQuery, resetQuery } =
    useQuerySync<GigEntity>(defaulFetchGigsQuery);

  const pageSize = Number(query?.pageSize);
  const page = Number(query?.page ?? 1);
  const totalItems = pagingMetadata?.itemCount ?? 0;

  useEffect(() => {
    if (response) {
      setGigs(response.data as any);
      setPagingMetadata(response.meta);
    }
  }, [response]);

  console.log(gigs);

  const filteredGigs = useMemo(() => {
    const { status } = query.filters ?? {};

    return gigs.filter((order: any) => {
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
  }, [gigs, query.filters]);

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

  const sortedGigs = [...filteredGigs].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    const aVal = getNestedValue(a, key);
    const bVal = getNestedValue(b, key);

    if (aVal === bVal) return 0;

    if (key === "date" || key === "createdAt" || key === "updatedAt") {
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
    const data = gigs.map((_) => {
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

  if (error)
    return (
      <ErrorOrEmptyState isLoading={isLoading} isError={error} retry={mutate} />
    );

  return (
    <DashboardMainContent>
      <DashboardMainContentHeader>
        <p>Manage Gigs</p>

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
      {!isLoading && <GigsStats gigs={gigs} />}
      {!isLoading && (
        <Card>
          <CardContent className="p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {/* <Input
                 type="text"
                 placeholder="Search by title..."
                 value={filters.keyword}A
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
                  {gigStatus.map((_) => (
                    <option key={_} value={_}>
                      {_}
                    </option>
                  ))}
                </select>

                {/* <Button variant="outline" onClick={handleExportCSV}>
                 <Download className="mr-1 h-4 w-4" /> Export 
               </Button> */}

                <Button
                  variant="outline"
                  onClick={() => {
                    router.replace("/dashboard/freelancer/gigs/new");
                  }}
                  className="rounded-sm border border-green-500 bg-white px-2 py-1 whitespace-nowrap text-green-500"
                >
                  Create new gig
                </Button>

                {/* <AdvancedSearchDialog /> */}
              </div>
            </div>

            <Table>
              <TableHeaderSection
                handleSort={handleSort}
                getSortIcon={getSortIcon}
                actorType={actorType}
              />

              <TableBody>
                {sortedGigs.map((_, index) => {
                  const completePercent = (
                    (_.orderCompleteCount /
                      (_.orderCount != 0 ? _.orderCount : 1)) *
                    100
                  ).toFixed(2);

                  return (
                    <React.Fragment key={_.id}>
                      <TableRow
                        className={clsx(
                          "w-fit",
                          (deletingRows.includes(_.id) ||
                            processingId === _.id) &&
                            "pointer-events-none opacity-50",
                        )}
                      >
                        <TableCell>
                          {(page - 1) * pageSize + index + 1}
                        </TableCell>

                        <TableCell className="max-w-[400px] truncate">
                          {_.title}
                        </TableCell>

                        {actorType === ActorType.ADMIN && (
                          <TableCell>{_.freelancer.email}</TableCell>
                        )}

                        <TableCell>
                          {_.basicPrice} - {_.standardPrice} - {_.premiumPrice}
                        </TableCell>

                        <TableCell>
                          <GigStatusBadge status={_.status} />
                        </TableCell>

                        <TableCell>{_.ratingAverage}</TableCell>

                        <TableCell>{_.viewCount}</TableCell>

                        <TableCell>
                          <span> {_.orderCompleteCount} </span>
                          <span>({completePercent} %)</span>
                        </TableCell>

                        <TableCell>{_.favoriteCount}</TableCell>
                      </TableRow>

                      {/* Action */}
                      <TableRow
                        className={clsx(
                          "w-fit",
                          (deletingRows.includes(_.id) ||
                            processingId === _.id) &&
                            "pointer-events-none opacity-50",
                        )}
                      >
                        <TableCell colSpan={11} className="bg-gray-50">
                          <div className="flex pl-10">
                            {actorType == ActorType.FREELANCER && (
                              <GigStatusButtonsFreelancer
                                status={_.status}
                                onViewDetails={() => {
                                  window.open(`/gig/${_.slug} `, "_blank");
                                }}
                                onActive={() => {
                                  setSelectedId(_.id);
                                  setShowActiveDialog(true);
                                }}
                                onEdit={() => {
                                  router.push(
                                    `/dashboard/freelancer/gigs/edit/?id=${_.id}`,
                                  );
                                }}
                                onPause={() => {
                                  setSelectedId(_.id);
                                  setShowPausePauseGigDialog(true);
                                }}
                                onDelete={() => {
                                  setSelectedId(_.id);
                                  setShowDeleteDialog(true);
                                }}
                              />
                            )}

                            {actorType == ActorType.ADMIN && (
                              <GigStatusButtonsAdmin
                                status={_.status}
                                onViewDetails={() => {
                                  window.open(`/gig/${_.slug} `, "_blank");
                                }}
                                onActive={() => {
                                  setSelectedId(_.id);
                                  setShowActiveDialog(true);
                                }}
                                onEdit={() => {
                                  router.push(
                                    `/dashboard/freelancer/gigs/edit/?id=${_.id}`,
                                  );
                                }}
                                onPause={() => {
                                  setSelectedId(_.id);
                                  setShowPausePauseGigDialog(true);
                                }}
                                onDelete={() => {
                                  setSelectedId(_.id);
                                  setShowDeleteDialog(true);
                                }}
                                onReject={() => {
                                  setSelectedId(_.id);
                                  setShowRejectDialog(true);
                                }}
                              />
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>

            <>
              <Dialog
                open={showActiveDialog}
                onOpenChange={setShowActiveDialog}
              >
                <DialogContent>
                  <DialogHeader>
                    Are you sure you want to active this service?
                  </DialogHeader>
                  <DialogFooter className="mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowActiveDialog(false)}
                    >
                      Cancel
                    </Button>

                    <Button
                      variant="outline"
                      className={clsx(
                        `rounded-sm border border-green-500 bg-white`,
                        `text-green-500 hover:text-green-500`,
                      )}
                      onClick={async () => {
                        try {
                          if (!selectedId) return;
                          setProcessing(true);

                          const response = await updateGig(selectedId, {
                            status: GigStatus.ACTIVE,
                          });

                          if (response.status === 200) {
                            mutate();
                          }
                        } catch (error) {
                          toast.error("Some error happen.");
                        } finally {
                          setSelectedId(undefined);
                          setProcessingId(undefined);
                          setProcessing(false);
                          setShowActiveDialog(false);
                        }
                      }}
                    >
                      {processing && (
                        <Loader2 className="animate-spin" size={18} />
                      )}
                      {processing ? "Processing..." : "Confirm Active"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog
                open={showPauseGigDialog}
                onOpenChange={setShowPausePauseGigDialog}
              >
                <DialogContent>
                  <DialogHeader>
                    Are you sure you want to pause this service?
                  </DialogHeader>
                  <DialogFooter className="mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowPausePauseGigDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="outline"
                      className={clsx(
                        `rounded-sm border border-orange-500 bg-white`,
                        `text-orange-500 hover:text-orange-500`,
                      )}
                      onClick={async () => {
                        try {
                          if (!selectedId) return;
                          setProcessing(true);

                          const response = await updateGig(selectedId, {
                            status: GigStatus.PAUSED,
                          });

                          if (response.status === 200) {
                            mutate();
                          }
                        } catch (error) {
                          toast.error("Some error happen.");
                        } finally {
                          setSelectedId(undefined);
                          setProcessingId(undefined);
                          setProcessing(false);
                          setShowPausePauseGigDialog(false);
                        }
                      }}
                    >
                      {processing && (
                        <Loader2 className="animate-spin" size={18} />
                      )}
                      {processing ? "Processing..." : "Confirm Pause"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
              >
                <DialogContent>
                  <DialogHeader>
                    Are you sure you want to delete the selected gig?
                  </DialogHeader>
                  <DialogFooter className="mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="outline"
                      className={clsx(
                        `rounded-sm border border-red-500 bg-white`,
                        `text-red-500 hover:text-red-500`,
                      )}
                      onClick={async () => {
                        try {
                          if (!selectedId) return;

                          setProcessing(true);
                          const response = await deleteGig(selectedId);

                          if (response.status === 200) {
                            mutate();
                          }
                        } catch (error) {
                          toast.error("Some error happen.");
                        } finally {
                          setSelectedId(undefined);
                          setProcessingId(undefined);
                          setProcessing(false);
                          setShowDeleteDialog(false);
                        }
                      }}
                    >
                      {processing && (
                        <Loader2 className="animate-spin" size={18} />
                      )}

                      {processing ? "Processing..." : "Confirm Delete"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog
                open={showRejectDialog}
                onOpenChange={setShowRejectDialog}
              >
                <DialogContent>
                  <DialogHeader>
                    Are you sure you want to reject the selected gig?
                  </DialogHeader>
                  <DialogFooter className="mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowRejectDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="outline"
                      className={clsx(
                        `rounded-sm border border-red-500 bg-white`,
                        `text-red-500 hover:text-red-500`,
                      )}
                      onClick={async () => {
                        try {
                          if (!selectedId) return;

                          setProcessing(true);

                          const response = await updateGig(selectedId, {
                            status: GigStatus.REJECTED,
                          });

                          if (response.status === 200) {
                            mutate();
                          }
                        } catch (error) {
                          toast.error("Some error happen.");
                        } finally {
                          setSelectedId(undefined);
                          setProcessingId(undefined);
                          setProcessing(false);
                          setShowRejectDialog(false);
                        }
                      }}
                    >
                      {processing && (
                        <Loader2 className="animate-spin" size={18} />
                      )}

                      {processing ? "Processing..." : "Confirm Reject"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          </CardContent>
        </Card>
      )}
      <PaginationWithPageSize totalItems={totalItems} />;
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="flex h-[90vh] flex-col md:max-w-[90vw]">
          <VisuallyHidden.Root>
            <DialogHeader>DialogHeader</DialogHeader>
          </VisuallyHidden.Root>
        </DialogContent>
      </Dialog>
    </DashboardMainContent>
  );
}

export default GigsManageTable;
