"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";
import { CalendarIcon, FilterIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { orderStatus } from "../dto";
import { useRouter } from "next/router";

export type Filters = {
  keyword: string;
  fromDate: Date | null;
  toDate: Date | null;
  minPrice: string;
  maxPrice: string;
  status: string;
};

export default function OrderAdvancedSearchDialog() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    keyword: "",
    fromDate: null,
    toDate: null,
    minPrice: "",
    maxPrice: "",
    status: "",
  });

  // Sync state from URL
  useEffect(() => {
    setFilters({
      keyword: searchParams.get("keyword") || "",
      fromDate: searchParams.get("fromDate")
        ? new Date(searchParams.get("fromDate")!)
        : null,
      toDate: searchParams.get("toDate")
        ? new Date(searchParams.get("toDate")!)
        : null,
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      status: searchParams.get("status") || "",
    });
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (filters.keyword) params.set("keyword", filters.keyword);
    if (filters.fromDate)
      params.set("fromDate", filters.fromDate.toISOString().split("T")[0]);
    if (filters.toDate)
      params.set("toDate", filters.toDate.toISOString().split("T")[0]);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.status) params.set("status", filters.status);

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl, undefined, { scroll: false });
    //  router.push(`?${params.toString()}`);
    setOpen(false);
  };

  const resetFilters = () => {
    setFilters({
      keyword: "",
      fromDate: null,
      toDate: null,
      minPrice: "",
      maxPrice: "",
      status: "",
    });
    router.push("?");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FilterIcon className="mr-2 h-4 w-4" />
          Advanced Search
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Advanced Search</DialogTitle>
          <DialogDescription>
            Filter orders by multiple criteria{" "}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Keyword</Label>
            <Input
              placeholder="Package title, gig title, customer name..."
              value={filters.keyword}
              onChange={(e) =>
                setFilters({ ...filters, keyword: e.target.value })
              }
            />
          </div>

          <div className="flex gap-2">
            <div className="flex-1 space-y-2">
              <Label>From day</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.fromDate
                      ? format(filters.fromDate, "dd/MM/yyyy")
                      : "Choose day"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={filters.fromDate!}
                    onSelect={(date) =>
                      setFilters({ ...filters, fromDate: date ?? null })
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex-1 space-y-2">
              <Label>To</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.toDate
                      ? format(filters.toDate, "dd/MM/yyyy")
                      : "Choose day"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={filters.toDate!}
                    onSelect={(date) =>
                      setFilters({ ...filters, toDate: date ?? null })
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1 space-y-2">
              <Label>From price</Label>
              <Input
                type="number"
                placeholder="0"
                value={filters.minPrice}
                onChange={(e) =>
                  setFilters({ ...filters, minPrice: e.target.value })
                }
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label>To</Label>
              <Input
                type="number"
                placeholder="1000000"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters({ ...filters, maxPrice: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="w-full rounded border px-2 py-1 text-sm"
            >
              <option value="">All Statuses</option>
              {orderStatus.map((_, index) => (
                <option key={index} value={_}>
                  {_}
                </option>
              ))}
            </select>
          </div>

          <DialogFooter className="flex justify-between pt-4">
            <Button type="button" variant="ghost" onClick={resetFilters}>
              Reset
            </Button>
            <Button type="submit">Find</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
