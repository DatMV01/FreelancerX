import useSWR from "swr";

import { getEarningsDataByYear } from "../wallet.api";

const fetcher = async (year: number) => {
  try {
    const response = await getEarningsDataByYear(year);

    if (response.status !== 200) {
      throw new Error(`Unexpected status code: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export function useGetEarningsDataByYear(year: number) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    year ? `/wallet/earnings/${year}` : null,
    () => fetcher(year),
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
