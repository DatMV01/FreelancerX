"use client";

import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  buildObjectFromQuery,
  buildQueryFromObject,
  QueryInput,
} from "@/lib/fitlers/buildQueryFromObject";

export function parseQueryFromRouter<Entity>(
  routerQuery: string,
  defaultQuery: QueryInput<Entity>,
): QueryInput<Entity> {
  const query: QueryInput<Entity> = { ...defaultQuery };

  const buildQuery = buildObjectFromQuery(routerQuery);

  if (buildQuery.page) query.page = buildQuery.page;
  if (buildQuery.pageSize) query.pageSize = buildQuery.pageSize;
  if (buildQuery.sorts) query.sorts = buildQuery.sorts;
  if (buildQuery.filters) query.filters = buildQuery.filters;
  if (buildQuery.fields) query.fields = buildQuery.fields;

  return query;
}

export function useQuerySync<Entity>(defaultQuery: QueryInput<Entity>) {
  const router = useRouter();
  const [query, setQueryState] = useState<QueryInput<Entity>>(defaultQuery);

  useEffect(() => {
    if (router.isReady) {
      const searchParams = router.asPath.split("?")[1] || "";
      const parsedQuery = parseQueryFromRouter<Entity>(
        searchParams,
        defaultQuery,
      );
      setQueryState(parsedQuery);
    }
  }, [router.isReady, router.asPath, defaultQuery]);

  const queryString = buildQueryFromObject(query);

  const setQuery = useCallback(
    (newQuery: Partial<QueryInput<Entity>>) => {
      const merged = { ...query, ...newQuery };
      debugger;
      if (merged.filters) {
        const cleanedFilters = Object.entries(merged.filters).reduce(
          (acc, [key, val]) => {
            if (val !== "" && val !== undefined && val !== null) {
              acc[key as keyof Entity] = val;
            }
            return acc;
          },
          {} as Record<keyof Entity, any>,
        );

        merged.filters = cleanedFilters;
      }

      const queryStr = buildQueryFromObject(merged);

      router.replace(
        {
          pathname: router.pathname,
          query: Object.fromEntries(new URLSearchParams(queryStr)),
        },
        undefined,
        { shallow: true },
      );
    },
    [query, router],
  );

  const removeFilter = useCallback(
    (key: keyof Entity) => {
      const filters: Record<string, any> = { ...(query.filters || {}) };
      delete filters[key as string];
      setQuery({ filters: filters as Record<keyof Entity, any> });
    },
    [query, setQuery],
  );

  const resetQuery = useCallback(() => {
    const queryStr = buildQueryFromObject(defaultQuery);
    router.replace(
      {
        pathname: router.pathname,
        query: Object.fromEntries(new URLSearchParams(queryStr)),
      },
      undefined,
      { shallow: true },
    );
  }, [router, defaultQuery]);

  return {
    query,
    queryString,
    setQuery,
    removeFilter,
    resetQuery,
  };
}
