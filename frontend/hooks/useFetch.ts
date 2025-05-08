import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";
import { selectUser } from "@/lib/redux/features/auth/authSlice";
import { useAppSelector } from "@/lib/redux/hooks";
import { AxiosError } from "axios";
import useSWR from "swr";

export const defaultSwrOptions = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  dedupingInterval: 0,
  refreshInterval: 0,
  shouldRetryOnError: false,
};

export const fetcher = async <T>(
  fetcherFn: (queryStr: string) => Promise<T>,
  queryString: string,
): Promise<T> => {
  try {
    const res = (await fetcherFn(queryString)) as any;
    return res.data;
  } catch (err) {
    const error = err as AxiosError;
    console.warn(error);
    throw error;
  }
};

export function useFetchByQuery<T>(
  queryString: string,
  fetcherFn: (queryStr: string) => Promise<T>,
  swrOptions?: Record<string, any>,
) {
  const userId = useAppSelector(selectUser)?.id;
  const shouldFetch = !!userId && !!queryString;

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    shouldFetch ? queryString : null,
    () => fetcher(fetcherFn, queryString),
    { ...defaultSwrOptions, ...swrOptions },
  );

  return {
    data,
    isLoading,
    isValidating,
    mutate,
    error,
    errorMessage: error?.response?.data?.message || error?.message,
    statusCode: error?.response?.status,
  };
}

export function useFetchByQuery2<T>({
  queryString,
  fetcherFn,
  swrOptions,
  requireLogin = true,
}: {
  queryString: string;
  fetcherFn: (queryStr: string) => Promise<T>;
  swrOptions?: Record<string, any>;
  requireLogin?: boolean;
}) {
  let shouldFetch = true;

  if (requireLogin) {
    const userId = useAppSelector(selectUser)?.id;
    shouldFetch = !!userId && !!queryString;
  }
  shouldFetch = !!queryString;

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    shouldFetch ? queryString : null,
    () => fetcher(fetcherFn, queryString),
    { ...defaultSwrOptions, ...swrOptions },
  );

  return {
    data,
    isLoading,
    isValidating,
    mutate,
    error,
    errorMessage: error?.response?.data?.message || error?.message,
    statusCode: error?.response?.status,
  };
}

export function useFetchByKey<T>(
  key: string,
  queryID: string,
  fetcherFn: (queryStr: string) => Promise<T>,
  swrOptions?: Record<string, any>,
) {
  const userId = useAppSelector(selectUser)?.id;
  const shouldFetch = !!userId && !!key;

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    shouldFetch ? key : null,
    () => fetcher(fetcherFn, queryID),
    { ...defaultSwrOptions, ...swrOptions },
  );

  return {
    data,
    isLoading,
    isValidating,
    mutate,
    error,
    errorMessage: error?.response?.data?.message || error?.message,
    statusCode: error?.response?.status,
  };
}

export function useFetchV1<T>({
  url,
  swrOptions,
  key,
  requireLogin = true,
}: {
  url: string | null;
  swrOptions?: Record<string, any>;
  key?: string;
  requireLogin?: boolean;
}) {
  let shouldFetch = true;

  if (requireLogin) {
    const userId = useAppSelector(selectUser)?.id;
    shouldFetch = !!userId && (!!url || !!key);
  }
  shouldFetch = !!url || !!key;

  const cacheKey = key ?? url;

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    shouldFetch ? cacheKey : null,
    async () => {
      try {
        if (!url) {
          throw new Error("URL cannot be null");
        }
        const res = await axiosInstanceV1.get(url);
        return res.data;
      } catch (err) {
        const error = err as AxiosError;
        console.warn(error);
        throw error;
      }
    },
    { ...defaultSwrOptions, ...swrOptions },
  );

  return {
    data,
    isLoading,
    isValidating,
    mutate,
    error,
    errorMessage: error?.response?.data?.message || error?.message,
    statusCode: error?.response?.status,
  };
}

export function useFetchPublicV1<T>(
  url: string,
  swrOptions?: Record<string, any>,
  key?: string,
) {
  const shouldFetch = !!url || !!key;

  const cacheKey = key ?? url;

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    shouldFetch ? cacheKey : null,
    async () => {
      try {
        const res = await axiosInstanceV1.get(url);
        return res.data;
      } catch (err) {
        const error = err as AxiosError;
        console.warn(error);
        throw error;
      }
    },
    { ...defaultSwrOptions, ...swrOptions },
  );

  return {
    data,
    isLoading,
    isValidating,
    mutate,
    error,
    errorMessage: error?.response?.data?.message || error?.message,
    statusCode: error?.response?.status,
  };
}
