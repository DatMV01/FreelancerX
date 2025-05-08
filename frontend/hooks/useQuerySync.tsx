"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  buildQueryFromObject,
  QueryInput,
} from "@/lib/fitlers/buildQueryFromObject";

function parseFromUrl<Entity>(
  params: URLSearchParams,
  defaultQuery: QueryInput<Entity>,
): QueryInput<Entity> {
  const page = parseInt(params.get("page") || "") || defaultQuery.page;
  const pageSize =
    parseInt(params.get("pageSize") || "") || defaultQuery.pageSize;
  const keyword = params.get("keyword") ?? defaultQuery.keyword;

  const sorts: QueryInput<Entity>["sorts"] = {};
  const filters: QueryInput<Entity>["filters"] = {};
  const fields: QueryInput<Entity>["fields"] = [];

  let hasSorts = false;
  let hasFilters = false;
  let hasFields = false;

  
  for (const [key, value] of params.entries()) {
    if (key.startsWith("sorts.")) {
      const k = key.replace("sorts.", "") as keyof Entity;
      sorts[k] = value as "ASC" | "DESC";
      hasSorts = true;
    } else if (key.startsWith("filters.")) {
      const k = key.replace("filters.", "") as keyof Entity;
      filters[k] = parseValue(value);
      hasFilters = true;
    } else if (key === "fields") {
      fields.push(...(value.split(",") as (keyof Entity)[]));
      hasFields = true;
    }
  }

  return {
    page,
    pageSize,
    keyword,
    sorts: hasSorts ? sorts : defaultQuery.sorts,
    filters: hasFilters ? filters : defaultQuery.filters,
    fields: hasFields ? fields : defaultQuery.fields,
  };
}

// Hàm parse để chuyển giá trị từ URL string thành giá trị đúng kiểu
function parseValue(value: string) {
  if (value === "true" || value === "false") return value === "true"; // parse boolean
  if (!isNaN(Number(value))) return Number(value); // parse number
  if (!isNaN(Date.parse(value))) return new Date(value); // parse date
  if (value.includes(";")) return value.split(";").map((s) => s.trim()); // parse mảng
  return value; // return string as default
}

function buildUrlQuery<Entity>(query: QueryInput<Entity>): string {
  const params = new URLSearchParams();

  params.set("page", String(query.page));
  params.set("pageSize", String(query.pageSize));

  if (query.keyword) {
    params.set("keyword", query.keyword);
  }

  if (query.sorts) {
    const querySortsEntries = Object.entries(query.sorts);
    for (const [key, value] of querySortsEntries) {
      ;
      if (value) params.set(`sorts.${key}`, String(value));
    }
  }

  if (query.filters) {
    const queryFiltersEntries = Object.entries(query.filters);
    for (const [key, value] of queryFiltersEntries) {
      ;
      if (value !== undefined && value !== "") {
        // Check if the value is an array, to serialize it properly
        if (Array.isArray(value)) {
          params.set(`filters.${key}`, value.join(";"));
        } else {
          params.set(`filters.${key}`, String(value));
        }
      }
    }
  }

  if (query.fields?.length) {
    params.set("fields", query.fields.join(","));
  }

  return params.toString();
}

export function useQuerySync<Entity>(defaultQuery: QueryInput<Entity>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  ;

  const query: QueryInput<Entity> = useMemo(() => {
    return parseFromUrl<Entity>(searchParams, defaultQuery);
  }, [searchParams]);

  const setQuery = (
    newQuery: Partial<QueryInput<Entity>>,
    options: { replace?: boolean } = {},
  ) => {
    const merged: QueryInput<Entity> = {
      ...defaultQuery,
      ...query,
      ...newQuery,
      sorts: {
        ...query.sorts,
        ...newQuery.sorts,
      },
      filters: {
        ...query.filters,
        ...newQuery.filters,
      },
      fields: newQuery.fields ?? query.fields,
    };

    const url = `${pathname}?${buildUrlQuery(merged)}`;
    options.replace ? router.replace(url) : router.push(url);
  };

  const removeQuery = (keys: (keyof QueryInput<Entity>)[]) => {
    const updated: QueryInput<Entity> = { ...query };

    for (const key of keys) {
      delete updated[key];
    }

    const url = `${pathname}?${buildUrlQuery(updated)}`;
    router.replace(url);
  };

  const resetQuery = () => {
    const url = `${pathname}?${buildUrlQuery(defaultQuery)}`;
    router.replace(url);
  };

  return {
    query,
    queryString: buildQueryFromObject(query),
    setQuery,
    removeQuery,
    resetQuery,
  };
}
