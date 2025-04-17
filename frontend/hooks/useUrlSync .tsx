import { useRouter } from "next/router";
import { useEffect, useState, useCallback, useRef } from "react";

export interface FilterParams {
  page: number;
  pageSize: number;
  status?: string;
  keyword?: string;
  sort?: string;
  tag?: string;
  fromDate?: string;
  toDate?: string;
}

const defaultFilters: FilterParams = {
  page: 1,
  pageSize: 10,
  status: "",
  keyword: "",
  sort: "",
  tag: "",
  fromDate: "",
  toDate: "",
};

export function useFilterParams() {
  const router = useRouter();
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);
  const hasMounted = useRef(false); // Track mount status to avoid effects firing prematurely
  const prevFilters = useRef<FilterParams>(filters); // Track previous filters to prevent unnecessary updates

  // Parse URL params into state
  useEffect(() => {
    const query = router.query;

    const parsed: FilterParams = {
      page: parseInt(query.page as string) || 1,
      pageSize: parseInt(query.pageSize as string) || 10,
      status: (query.status as string) || "",
      keyword: (query.keyword as string) || "",
      sort: (query.sort as string) || "",
      tag: (query.tag as string) || "",
      fromDate: (query.fromDate as string) || "",
      toDate: (query.toDate as string) || "",
    };

    // Set filters only if they are different from the current state
    if (JSON.stringify(parsed) !== JSON.stringify(filters)) {
      setFilters(parsed);
    }
    console.log("Parsed filters from URL:", parsed); // Debugging line to check parsed filters
    
  }, [router.query]);

  // Update the URL with filters when they change
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return; // Skip the first run (on mount)
    }

    // Avoid infinite loop by checking if filters actually changed
    if (JSON.stringify(filters) === JSON.stringify(prevFilters.current)) {
      return; // If no change, don't update URL
    }

    // Construct the clean query object
    const cleanQuery: Record<string, string> = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "" && value !== "0")
        cleanQuery[key] = String(value);
    });

    // Update URL if filters have changed
    router.replace(
      {
        pathname: router.pathname,
        query: cleanQuery,
      },
      undefined,
      { scroll: false },
    );

    // Update previous filters after the change
    prevFilters.current = filters;
  }, [filters, router]);

  // Function to update filters
  const updateFilter = useCallback((partial: Partial<FilterParams>) => {
    setFilters((prev) => ({
      ...prev,
      ...partial,
    }));
  }, []);

  // Function to reset filters to default
  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return { filters, updateFilter, resetFilters };
}
