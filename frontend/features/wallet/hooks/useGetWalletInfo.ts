import useSWR from "swr";

import { getWalletInfo } from "../wallet.api";

const fetcher = async () => {
  try {
    const response = await getWalletInfo();

    if (response.status !== 200) {
      throw new Error(`Unexpected status code: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Để SWR có thể xử lý lỗi
  }
};

export function useGetWalletInfo(userId: string) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    userId ? `/wallet/${userId}` : null,
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
