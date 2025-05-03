import { useRouter } from "next/router";
import { useMemo } from "react";

export function useFilterParams() {
  const router = useRouter();

  const params = useMemo(() => {
    const query = router.query;
    return Object.fromEntries(
      Object.entries(query).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]),
    ) as Record<string, string>;
  }, [router.query]);

  const getBaseQuery = (): Record<string, any> => {
    const query = { ...router.query };

    // Giữ lại slug nếu có (cho dynamic routes như [...slug])
    if (router.query.slug) {
      query.slug = router.query.slug;
    }

    return query;
  };

  const setParam = (key: string, value: string | number | null) => {
    const newQuery = { ...getBaseQuery() };

    if (value === null || value === "") {
      delete newQuery[key];
    } else {
      newQuery[key] = String(value);
    }

    router.push(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true },
    );
  };

  const setQuery = (query: any) => {
    const newQuery = query;

    router.push(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true },
    );
  };

  const resetParams = () => {
    const query: Record<string, any> = {};

    // Chỉ giữ lại slug nếu đang ở dynamic route
    if (router.query.slug) {
      query.slug = router.query.slug;
    }

    router.push(
      {
        pathname: router.pathname,
        query,
      },
      undefined,
      { shallow: true },
    );
  };

  const countActiveParams = useMemo(() => {
    return Object.entries(params).filter(([key, value]) => {
      return (
        key !== "slug" && value !== "" && value !== undefined && value !== null
      );
    }).length;
  }, [params]);

  return {
    params,
    setParam,
    setQuery,
    resetParams,
    countActiveParams,
  };
}
