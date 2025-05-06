import useSWR from "swr";

import {
  buildQueryFromObject,
  QueryInput,
} from "@/lib/fitlers/buildQueryFromObject";
import { fetchWalletTransactions } from "../wallet.api";
import { WalletTransactionEntity } from "../wallet.type";

export const defaultWalletTransactionQuery: QueryInput<WalletTransactionEntity> =
  {
    page: 1,
    pageSize: 10,
    sorts: { processedAt: "DESC", createdAt: "DESC" },
  } as any;

const fetcher = async (queryStr: string) => {
  try {
    const response = await fetchWalletTransactions(queryStr);

    if (response.status !== 200) {
      throw new Error(`Unexpected status code: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Để SWR có thể xử lý lỗi
  }
};

export function useGetWalletTransactions(queryString: string) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    queryString ? queryString : null,
    fetcher,
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
