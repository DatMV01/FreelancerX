"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFilterParams } from "@/hooks/useUrlSync ";
import {
     ChevronLeft,
     ChevronRight
} from "lucide-react";
import { useState } from "react";

interface Props {
     pagingMetadata: any;
}

export default function PaginationWithPageSize2({ pagingMetadata }: Props) {
 
  const { filters, updateFilter, resetFilters } = useFilterParams();

 
  const [goToPage, setGoToPage] = useState("");

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

  return (
    <div>
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
  );
}
