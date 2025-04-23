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
import GigsStats from "@/features/gig/components/GigsStats";
import { fetchGigs } from "@/features/gig/gig.api";
import { gigStatus, GigStatus } from "@/features/gig/gig.types";
import { useFilterParams } from "@/hooks/useUrlSync ";
import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";
import { CircularProgress } from "@mui/material";
import clsx from "clsx";
import { formatDate } from "date-fns";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Hourglass,
  NotepadTextDashed,
  PauseCircle,
  Pencil,
  PlayCircle,
  Send,
  X,
  XCircle
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import * as XLSX from "xlsx";

export const statusMap = {
  ACTIVE: {
    label: "ACTIVE",
    color: "bg-green-100 text-green-800",
    icon: <PlayCircle className="text-green-500" />,
  },
  DRAFT: {
    label: "DRAFT",
    color: "bg-indigo-100 text-indigo-800",
    icon: <NotepadTextDashed className="text-indigo-500" />,
  },
  PAUSED: {
    label: "PAUSED",
    color: "bg-orange-100 text-orange-800",
    icon: <PauseCircle className="animate-spin text-orange-500" />,
  },
  REQUIRE_MODIFICATION: {
    label: "REQUIRE MODIFICATION",
    color: "bg-yellow-100 text-yellow-800",
    icon: <Pencil className="text-yellow-500" />,
  },
  REJECTED: {
    label: "REJECTED",
    color: "bg-red-100 text-red-800",
    icon: <XCircle className="text-red-500" />,
  },
  // DELETED: {
  //   label: "DELETED",
  //   color: "bg-red-100 text-red-800",
  //   icon: <X className="text-red-500" />,
  // },
  PENDING_APPROVAL: {
    label: "PENDING APPROVAL",
    color: "bg-gray-100 text-gray-800",
    icon: <Hourglass className="text-gray-500" />,
  },
};

const useGigs = ({
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
    ? [`/gigs`, page, limit, filters]
    : [`/gigs`, page, limit];

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    key,
    () => fetchGigs({ page, limit, filters }),
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

function FreelancerManageGigsPage() {
  const router = useRouter();

  const { filters, updateFilter, resetFilters } = useFilterParams();
  const [gigs, setGigs] = useState<any[]>([]);
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
  const { data, isLoading, isValidating, error, mutate, key } = useGigs({
    page,
    limit,
    filters: `status:${filters.status?.toUpperCase()}`,
  });

  // const { data, isLoading, isValidating, error } = useSWR(
  //   "/freelancer/gigs/manage",
  //   fetchFreelancerManageGigs,
  //   {
  //     revalidateOnFocus: false,
  //     revalidateOnReconnect: false,
  //     refreshInterval: 0,
  //   },
  // );

  useEffect(() => {
    if (data) {
      setGigs(data.data as any);
    }

    console.log(data, "data");
  }, [data]);

  useEffect(() => {
    updateFilter({ page: 1 });
    setGoToPage("");
  }, [filters.status]);

  const filteredGigs = useMemo(() => {
    const { keyword, status } = filters;

    return gigs.filter((_: any) => {
      const matchesKeyword =
        keyword && keyword !== ""
          ? _.title.toLowerCase().includes(keyword.toLowerCase())
          : true;

      const matchesStatus = status ? _.status === status : true;

      return matchesKeyword && matchesStatus;
    });
  }, [gigs, filters]);

  const totalPages = Math.ceil(filteredGigs?.length / filters.pageSize);
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

  const paginatedGigs = sortedGigs.slice(
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
    const idsOnPage = paginatedGigs.map((o) => o.id);
    const allSelected = idsOnPage.every((id) => selectedRows.includes(id));
    if (allSelected) {
      setSelectedRows((prev) => prev.filter((id) => !idsOnPage.includes(id)));
    } else {
      setSelectedRows((prev) => [...new Set([...prev, ...idsOnPage])]);
    }
  };

  const handleDeleteSelectedIds = async () => {
    // setDeletingRows(selectedRows);
    // setShowDeleteSelectedIdsDialog(false);

    // setTimeout(() => {
    //   if (typeof setGigs === "function") {
    //     setGigs((prev) => prev.filter((o) => !selectedRows.includes(o.id)));
    //   }
    //   setSelectedRows([]);
    //   setDeletingRows([]);
    // }, 1000);

    setDeletingRows(selectedRows);
    setShowDeleteSelectedIdsDialog(false);

    const results = await Promise.all(selectedRows.map(deleteGig));
    const success = results.every((result) => result === true);

    debugger;
    if (success) {
      setGigs((prev) => prev.filter((o) => !selectedRows.includes(o.id)));

      toast.success("handleDeleteSelectedIds", {
        description: "Thông tin đơn hàng đã được cập nhật.",
        duration: 3000,
      });
    } else {
      toast.error("handleDeleteSelectedIds", {
        description: "Có lỗi xảy ra khi xóa dịch vụ.",
        duration: 3000,
      });
    }
    if (success) {
    }
    setSelectedRows([]);
    setDeletingRows([]);
  };

  const handleDeleteSelectedId = async () => {
    // setProcessingId(selectedId || "");
    // setShowDeleteSelectedIdDialog(false);

    // setTimeout(() => {
    //   if (typeof setGigs === "function") {
    //     setGigs((prev) => prev.filter((o) => o.id !== selectedId));
    //   }

    //   toast.success("handleDeleteSelectedId", {
    //     description: "Thông tin đơn hàng đã được cập nhật.",
    //     duration: 3000,
    //   });

    //   setSelectedId(undefined);
    //   setProcessingId(undefined);
    // }, 1000);

    setProcessingId(selectedId || "");
    setShowDeleteSelectedIdDialog(false);

    const success = await deleteGig(selectedId || "");

    if (success) {
      setGigs((prev) => prev.filter((o) => o.id !== selectedId));

      toast.success("Delete OK", {
        description: "Thông tin đơn hàng đã được cập nhật.",
        duration: 3000,
      });
    }

    setSelectedId(undefined);
    setProcessingId(undefined);
  };

  const deleteGig = async (gigId: string) => {
    debugger;
    try {
      const response = await axiosInstanceV1.delete(`gig/${gigId}`);
      if (response.status === 200) {
        return true;
      }
      throw new Error(`Failed to delete gig with ID: ${gigId}`);
    } catch (error) {
      console.error(error);
      alert(`Error deleting gig ${gigId}: ${error}`);
      return false;
    }
  };

  const [showPauseSelectedIdDialog, setShowPauseSelectedIdDialog] =
    useState(false);
  const handlePauseService = async () => {
    setProcessingId(selectedId || "");
    setShowPauseSelectedIdDialog(false);

    const response = await axiosInstanceV1.patch(`/gig/${selectedId}`, {
      status: GigStatus.PAUSED,
    });

    if (response.status === 200) {
      setGigs((prev) => prev.filter((o) => o.id !== selectedId));
    }

    setSelectedId(undefined);
    setProcessingId(undefined);
  };

  const [showActiveSelectedIdDialog, setShowActiveSelectedIdDialog] =
    useState(false);
  const handleActiveService = async () => {
    setProcessingId(selectedId || "");
    setShowActiveSelectedIdDialog(false);

    const response = await axiosInstanceV1.patch(`/gig/${selectedId}`, {
      status: GigStatus.ACTIVE,
    });

    if (response.status === 200) {
      setGigs((prev) => prev.filter((o) => o.id !== selectedId));
    }

    setSelectedId(undefined);
    setProcessingId(undefined);
  };

  // const [
  //   showSubmitForApprovalSelectedIdDialog,
  //   setShowSubmitForApprovalSelectedIdDialog,
  // ] = useState(false);
  // const handleSubmitForApprovalService = async () => {
  //   setProcessingId(selectedId || "");
  //   setShowSubmitForApprovalSelectedIdDialog(false);

  //   const response = await axiosInstanceV1.patch(`/gig/${selectedId}`, {
  //     status: GigStatus.PENDING_APPROVAL,
  //   });

  //   if (response.status === 200) {
  //     setGigs((prev) => prev.filter((o) => o.id !== selectedId));
  //   }

  //   setSelectedId(undefined);
  //   setProcessingId(undefined);
  // };

  const handleExportCSV = () => {
    const data = gigs.map((_) => {
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

      body: gigs.map((_: any) => [
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
    doc.save(`gigs.pdf`);
  };

  if (isLoading || isValidating)
    return (
      <div className="flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  if (error) return <div>Failed to load data.</div>;

  return (
    <div className="flex flex-col space-y-6">
      <h1 className="text-2xl font-bold">Manage Gigs</h1>

      <GigsStats gigs={gigs} />

      {/* <OrderChart /> */}
      <Card>
        <CardContent className="p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Input
                type="text"
                placeholder="Search by title..."
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
                {gigStatus.map((_) => (
                  <option key={_} value={_}>
                    {_}
                  </option>
                ))}
              </select>

              <Button variant="outline" onClick={handleExportCSV}>
                <Download className="mr-1 h-4 w-4" /> Export CSV
              </Button>

              {/* <Button variant="outline" onClick={handleExportPDF}>
                <FileDown className="mr-2 h-4 w-4" />
                Export PDF
              </Button> */}

              <button
                onClick={() => {
                  router.replace("/dashboard/freelancer/gigs/new");
                }}
                className="rounded-sm border border-green-500 bg-white px-2 py-1 whitespace-nowrap text-green-500"
              >
                Create new service
              </button>

              {/* <AdvancedSearchDialog /> */}
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
                      paginatedGigs.length > 0 &&
                      paginatedGigs.every((o) => selectedRows.includes(o.id))
                    }
                  />
                </TableHead>
                <TableHead>#</TableHead>
                <TableHead
                  onClick={() => handleSort("title")}
                  className="cursor-pointer"
                >
                  Title {getSortIcon("title")}
                </TableHead>

                <TableHead
                  onClick={() => handleSort("basicPrice")}
                  className="cursor-pointer"
                >
                  Basic Price {getSortIcon("basicPrice")}
                </TableHead>

                <TableHead
                  onClick={() => handleSort("standardPrice")}
                  className="cursor-pointer"
                >
                  Standard Price {getSortIcon("standardPrice")}
                </TableHead>

                <TableHead
                  onClick={() => handleSort("premiumPrice")}
                  className="cursor-pointer"
                >
                  Premium Price {getSortIcon("premiumPrice")}
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
                  onClick={() => handleSort("completeOrderCount")}
                  className="cursor-pointer"
                >
                  Orders {getSortIcon("completeOrderCount")}
                </TableHead>

                <TableHead
                  onClick={() => handleSort("favoriteCount")}
                  className="cursor-pointer"
                >
                  Favorites {getSortIcon("favoriteCount")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedGigs.map((_, index) => (
                <React.Fragment key={_.id}>
                  {/* Information */}
                  <TableRow
                    className={clsx(
                      "w-fit",
                      (deletingRows.includes(_.id) || processingId === _.id) &&
                        "pointer-events-none opacity-50",
                    )}
                  >
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(_.id)}
                        onChange={() => toggleSelectRow(_.id)}
                      />
                    </TableCell>

                    <TableCell>
                      {(currentPage - 1) * filters.pageSize + index + 1}
                    </TableCell>

                    <TableCell>{_.title}</TableCell>

                    <TableCell>{_.basicPrice}</TableCell>
                    <TableCell>{_.standardPrice}</TableCell>
                    <TableCell>{_.premiumPrice}</TableCell>

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

                    <TableCell>{_.ratingAverage}</TableCell>

                    <TableCell>{_.viewCount}</TableCell>

                    <TableCell>{_.completeOrderCount}</TableCell>

                    <TableCell>{_.favoriteCount}</TableCell>
                  </TableRow>

                  {/* Action */}
                  <TableRow
                    className={clsx(
                      "w-fit",
                      (deletingRows.includes(_.id) || processingId === _.id) &&
                        "pointer-events-none opacity-50",
                    )}
                  >
                    <TableCell colSpan={11} className="bg-gray-50">
                      <div className="flex flex-wrap justify-start gap-2 pl-10">
                        <Button variant="outline" asChild>
                          <Link
                            href={`/gig/${_.slug}?mode=preview`}
                            target="_blank"
                          >
                            <Eye className="h-4" /> Preview
                          </Link>
                        </Button>

                        {_.status == GigStatus.ACTIVE && (
                          <>
                            <Button
                              variant="outline"
                              onClick={(e) => {
                                e.preventDefault();
                                setSelectedId(_.id);
                                setShowPauseSelectedIdDialog(true);
                              }}
                            >
                              <PauseCircle className="h-4 text-orange-500" />
                              PAUSE
                            </Button>

                            <Button
                              variant="outline"
                              onClick={(e) => {
                                e.preventDefault();

                                router.push(
                                  `/dashboard/freelancer/gigs/edit/?id=${_.id}`,
                                );
                              }}
                            >
                              <Pencil className="h-4 text-green-500" /> EDIT
                            </Button>
                          </>
                        )}

                        {_.status == GigStatus.DRAFT && (
                          <>
                            <Button
                              variant="outline"
                              onClick={(e) => {
                                e.preventDefault();
                                setSelectedId(_.id);
                                setShowActiveSelectedIdDialog(true);
                              }}
                            >
                              <Send className="h-4 text-green-500" /> Active
                            </Button>
                            <Button
                              variant="outline"
                              onClick={(e) => {
                                e.preventDefault();

                                router.push(
                                  `/dashboard/freelancer/gigs/edit/?id=${_.id}`,
                                );
                              }}
                            >
                              <Pencil className="h-4 text-green-500" /> EDIT
                            </Button>
                          </>
                        )}

                        {_.status == GigStatus.PAUSED && (
                          <>
                            <Button
                              variant="outline"
                              onClick={(e) => {
                                e.preventDefault();
                                setSelectedId(_.id);
                                setShowActiveSelectedIdDialog(true);
                              }}
                            >
                              <Send className="h-4 text-green-500" /> Active
                            </Button>

                            <Button
                              variant="outline"
                              onClick={(e) => {
                                e.preventDefault();

                                router.push(
                                  `/dashboard/freelancer/gigs/edit/?id=${_.id}`,
                                );
                              }}
                            >
                              <Pencil className="h-4 text-green-500" /> EDIT
                            </Button>
                          </>
                        )}

                        <Button
                          variant="outline"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedId(_.id);
                            setShowDeleteSelectedIdDialog(true);
                          }}
                        >
                          <X className="h-4 text-red-500" /> Delete
                        </Button>

                        {/* {_.status !== GigStatus.PENDING_APPROVAL && (
                          <Button
                            variant="outline"
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedId(_.id);
                              setShowDeleteSelectedIdDialog(true);
                            }}
                          >
                            <Ban className="h-4 text-red-500" /> Delete
                          </Button>
                        )} */}

                        {/* {_.status == GigStatus.REJECTED && (
                          <>
                            <Button
                              variant="outline"
                              onClick={(e) => {
                                e.preventDefault();
                                setSelectedId(_.id);
                                setShowSubmitForApprovalSelectedIdDialog(true);
                              }}
                            >
                              <Send className="h-4 text-green-500" /> Submit for
                              approval
                            </Button>

                            <Button
                              variant="outline"
                              onClick={(e) => {
                                e.preventDefault();

                                router.push(
                                  `/dashboard/freelancer/gigs/edit/?id=${_.id}`,
                                );
                              }}
                            >
                              <Pencil className="h-4 text-green-500" /> EDIT
                            </Button>
                          </>
                        )} */}
                      </div>
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
                onClick={(e) => {
                  e.preventDefault();
                  setShowDeleteSelectedIdsDialog(true);
                }}
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

      <Dialog
        open={showDeleteSelectedIdsDialog}
        onOpenChange={setShowDeleteSelectedIdsDialog}
      >
        <DialogContent>
          <DialogHeader>
            Are you sure you want to delete the selected services?
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteSelectedIdsDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSelectedIds}>
              Confirm delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showDeleteSelectedIdDialog}
        onOpenChange={handleDeleteSelectedId}
      >
        <DialogContent className=" ">
          <DialogHeader>
            Are you sure you want to delete this service?
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteSelectedIdDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSelectedId}>
              Confirm delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showPauseSelectedIdDialog}
        onOpenChange={setShowPauseSelectedIdDialog}
      >
        <DialogContent>
          <DialogHeader>
            Are you sure you want to pause this service?
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowPauseSelectedIdDialog(false)}
            >
              Cancel
            </Button>
            <button
              className="rounded-sm border border-green-500 bg-white px-2 py-1 whitespace-nowrap text-green-500"
              onClick={handlePauseService}
            >
              Confirm Pause
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showActiveSelectedIdDialog}
        onOpenChange={setShowActiveSelectedIdDialog}
      >
        <DialogContent>
          <DialogHeader>
            Are you sure you want to active this service?
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowActiveSelectedIdDialog(false)}
            >
              Cancel
            </Button>
            <button
              className="rounded-sm border border-green-500 bg-white px-2 py-1 whitespace-nowrap text-green-500"
              onClick={handleActiveService}
            >
              Confirm Active
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

FreelancerManageGigsPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default FreelancerManageGigsPage;
