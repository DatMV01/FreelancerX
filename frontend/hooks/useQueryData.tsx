import useSWR from "swr";

export function useQueryData<T = any>(
  endpoint: string,
  queryString: string,
  fetcher: (url: string) => Promise<T>,
) {
  const url = `${endpoint}?${queryString}`;
  const { data, error, isLoading } = useSWR<T>(url, fetcher);

  return { data, error, isLoading };
}
