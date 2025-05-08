import useSWR from "swr";

import { QueryInput } from "@/lib/fitlers/query-utils";
import { fetchOrdersByBuyer } from "../order.api";
import { OrderEntity } from "../order.entity";

export const defaulFetchOrdersByBuyerQuery: QueryInput<OrderEntity> = {
  page: 1,
  pageSize: 10,
  sorts: { createdAt: "DESC", updatedAt: "DESC" },
} as any;

const fetcher = async (queryStr: string) => {
  try {
    const response = await fetchOrdersByBuyer(queryStr);

    if (response.status !== 200) {
      throw new Error(`Unexpected status code: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Để SWR có thể xử lý lỗi
  }
};

export function useGetOrdersByBuyer(queryString: string) {
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
