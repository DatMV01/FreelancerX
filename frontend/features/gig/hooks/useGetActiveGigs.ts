import useSWR from "swr";

import { QueryInput } from "@/lib/fitlers/query-utils";
import { GigEntity } from "../gig.entity";
import { fetchGigsV2 } from "../gig.api";
import { useQuerySync } from "@/hooks/useQuerySync";

export const defaulFetchGigsQuery: QueryInput<GigEntity> = {
  page: 1,
  pageSize: 10,
  sorts: { createdAt: "DESC", updatedAt: "DESC" },
} as any;

const fetcher = async (queryStr: string) => {
  try {
    const response = await fetchGigsV2(queryStr);

    if (response.status !== 200) {
      throw new Error(`Unexpected status code: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export function useGetActiveGigs() {
  const queryString =
    "page=1&pageSize=50&sorts=createdAt:DESC,updatedAt:DESC&filters=status:in_ACTIVE";

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    queryString,
    () => fetcher(queryString),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 0,
      refreshInterval: 0,
    },
  );

  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
  };
}
