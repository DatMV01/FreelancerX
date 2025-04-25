"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useFilterParams } from "@/hooks/useFilterParams";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export function FilterBar() {
  const { params, setParam, resetParams, countActiveParams } =
    useFilterParams();

  const handleApplyFilters = () => {
    toast.info("Call API");
  };

  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`${isFixed ? "top-0 right-0 left-0 z-50 md:fixed" : "relative"} transition-all`}
    >
      <div
        className={`${isFixed ? "mx-auto max-w-screen-2xl" : "w-full"} w-full`}
      >
        <div className="bg-muted mb-4 flex flex-col gap-4 rounded-xl border p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Price Range */}
            <Select
              value={params.priceRange || ""}
              onValueChange={(val) => setParam("priceRange", val)}
            >
              <SelectTrigger className="w-30">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-100000">Under 100K</SelectItem>
                <SelectItem value="100000-300000">100K - 300K</SelectItem>
                <SelectItem value="300000-500000">300K - 500K</SelectItem>
                <SelectItem value="500000-1000000">500K - 1M</SelectItem>
                <SelectItem value="1000000+">Above 1M</SelectItem>
              </SelectContent>
            </Select>

            {/* Delivery Time */}
            <Select
              value={params.deliveryTime || ""}
              onValueChange={(val) => setParam("deliveryTime", val)}
            >
              <SelectTrigger className="w-30">
                <SelectValue placeholder="Delivery Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Day</SelectItem>
                <SelectItem value="3">3 Days</SelectItem>
                <SelectItem value="7">7 Days</SelectItem>
                <SelectItem value="14">14 Days</SelectItem>
              </SelectContent>
            </Select>

            {/* Rating */}
            <Select
              value={params.rating || ""}
              onValueChange={(val) => setParam("rating", val)}
            >
              <SelectTrigger className="w-30">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>

            {/* Freelancer Level */}
            <Select
              value={params.level || ""}
              onValueChange={(val) => setParam("level", val)}
            >
              <SelectTrigger className="w-30">
                <SelectValue placeholder="Freelancer Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NEW">New</SelectItem>
                <SelectItem value="LEVEL1">Level 1</SelectItem>
                <SelectItem value="LEVEL2">Level 2</SelectItem>
                <SelectItem value="LEVEL3">Level 3</SelectItem>
              </SelectContent>
            </Select>

            {/* Language */}
            <Select
              value={params.language || ""}
              onValueChange={(val) => setParam("language", val)}
            >
              <SelectTrigger className="w-30">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Vietnamese">Vietnamese</SelectItem>
                <SelectItem value="Japanese">Japanese</SelectItem>
              </SelectContent>
            </Select>

            {/* Country */}
            <Select
              value={params.country || ""}
              onValueChange={(val) => setParam("country", val)}
            >
              <SelectTrigger className="w-30">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Vietnam">Vietnam</SelectItem>
                <SelectItem value="USA">USA</SelectItem>
                <SelectItem value="India">India</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Button + Apply Button */}
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="default"
              onClick={handleApplyFilters}
              disabled={countActiveParams == 0}
            >
              Apply Filters
            </Button>

            <Button variant="outline" onClick={resetParams}>
              <span>Clear Filters</span>
              {countActiveParams > 0 && (
                <span className="text-muted-foreground text-sm">
                  ({countActiveParams})
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
