import useSWR from "swr";

import { fetchWalletTransaction } from "../wallet.api";

const fetcher = async (transactionId: string) => {
  try {
    const response = await fetchWalletTransaction(transactionId);

    if (response.status !== 200) {
      throw new Error(`Unexpected status code: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Để SWR có thể xử lý lỗi
  }
};

export function useGetWalletTransaction(transactionId: string) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    transactionId ? `/wallet/transactions/${transactionId}` : null,
    () => fetcher(transactionId),
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
