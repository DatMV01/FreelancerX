import useSWR from "swr";
import { getUserById } from "../user.api";

const fetcher = async (id: string) => {
  try {
    const response = await getUserById(id);

    if (response.status !== 200) {
      throw new Error(`Unexpected status code: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Để SWR có thể xử lý lỗi
  }
};

export function useGetUserInfo(userId: string) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    userId ? `/user/${userId}` : null,
    () => fetcher(userId),
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
