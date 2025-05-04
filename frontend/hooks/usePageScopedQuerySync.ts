import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo } from "react";
import useSWR from "swr";
import {
  buildQueryFromObject,
  QueryInput,
} from "@/lib/fitlers/buildQueryFromObject";

export function parseQueryFromRouter<Entity>(
  routerQuery: Record<string, string | string[] | undefined>,
  defaultQuery: QueryInput<Entity>,
): QueryInput<Entity> {
  const query: QueryInput<Entity> = { ...defaultQuery };

  if (routerQuery.page) query.page = parseInt(routerQuery.page as string);
  if (routerQuery.pageSize)
    query.pageSize = parseInt(routerQuery.pageSize as string);

  if (routerQuery.sorts) {
    const sortObj: Record<string, "ASC" | "DESC"> = {};
    for (const s of (routerQuery.sorts as string).split(",")) {
      const [k, v] = s.split(":");
      sortObj[k] = v as "ASC" | "DESC";
    }
    query.sorts = sortObj as any;
  }

  if (routerQuery.filters) {
    const filterObj: Record<string, any> = {};
    for (const f of (routerQuery.filters as string).split(",")) {
      const [k, v] = f.split(":");
      if (v?.startsWith("[") && v.endsWith("]")) {
        filterObj[k] = v.slice(1, -1).split(";");
      } else {
        filterObj[k] = v;
      }
    }
    query.filters = filterObj as any;
  }

  if (routerQuery.fields) {
    query.fields = (routerQuery.fields as string).split(
      ",",
    ) as (keyof Entity)[];
  }

  return query;
}

export function useQuerySync<Entity>(
  defaultQuery: QueryInput<Entity>,
  scope?: string,
) {
  const router = useRouter();

  const query = useMemo(() => {
    return parseQueryFromRouter<Entity>(router.query, defaultQuery);
  }, [router.query]);

  const queryString = buildQueryFromObject(query);

  const setQuery = useCallback(
    (newQuery: Partial<QueryInput<Entity>>) => {
      const merged = { ...query, ...newQuery };

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
      const finalParams = Object.fromEntries(new URLSearchParams(queryStr));
      if (scope) finalParams["scope"] = scope;

      router.replace(
        {
          pathname: router.pathname,
          query: finalParams,
        },
        undefined,
        { shallow: true },
      );
    },
    [query, router, scope],
  );

  const resetQuery = useCallback(() => {
    const queryStr = buildQueryFromObject(defaultQuery);
    const finalParams = Object.fromEntries(new URLSearchParams(queryStr));
    if (scope) finalParams["scope"] = scope;

    router.replace(
      {
        pathname: router.pathname,
        query: finalParams,
      },
      undefined,
      { shallow: true },
    );
  }, [router, defaultQuery, scope]);

  const removeFilter = useCallback(
    (key: keyof Entity) => {
      const filters: Record<string, any> = { ...(query.filters || {}) };
      delete filters[key as string];
      setQuery({ filters: filters as Record<keyof Entity, any> });
    },
    [query, setQuery],
  );

  return {
    query,
    queryString,
    setQuery,
    removeFilter,
    resetQuery,
  };
}

// const {
//      query,
//      setQuery,
//      removeFilter,
//      resetQuery,
//    } = useQuerySync<OrderEntity>(defaultQuery, "orders");

// ==> ?page=1&filters=status:FAILED&scope=orders
