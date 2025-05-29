"use client";

//import { useRouter } from "next/router";
import { useMemo } from "react";

import {
  buildObjectFromQuery,
  buildQueryFromObject,
  QueryInput,
} from "@/lib/fitlers/query-utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const defaulFetchQuery = {
  page: 1,
  pageSize: 10,
  sorts: { createdAt: "DESC", updatedAt: "DESC" },
} as any;

export function useQuerySync<Entity>(defaultQuery: QueryInput<Entity>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query: QueryInput<Entity> = useMemo(() => {
    const fullQuery = searchParams.toString();
    const a = buildObjectFromQuery(fullQuery);
    return { ...a, ...defaultQuery } as any;
  }, [searchParams]);

  const setQuery = (
    newQuery: Partial<QueryInput<Entity>>,
    options: { replace?: boolean; syncToUrl?: boolean } = {},
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
    if (options.syncToUrl === false) return; // ⛔ Không sync lên URL

    const url = `${pathname}?${buildQueryFromObject(merged)}`;
    options.replace ? router.replace(url) : router.push(url);
  };

  const removeQuery = (keys: (keyof QueryInput<Entity>)[]) => {
    const updated: QueryInput<Entity> = { ...query };

    for (const key of keys) {
      delete updated[key];
    }

    const url = `${pathname}?${buildQueryFromObject(updated)}`;
    router.replace(url);
  };

  const resetQuery = () => {
    const url = `${pathname}?${buildQueryFromObject(defaultQuery)}`;
    router.replace(url);
  };

  const queryString = buildQueryFromObject(query);
  const queryStringDecode = decodeURIComponent(queryString);
  return {
    query,
    queryString,
    queryStringDecode,
    url: `${pathname}?${queryStringDecode}`,
    setQuery,
    removeQuery,
    resetQuery,
  };
}
