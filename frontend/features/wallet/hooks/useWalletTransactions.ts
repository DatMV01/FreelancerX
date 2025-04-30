import useSWR from "swr";

import { getWalletTransactions } from "../wallet.api";

const fetcher = async () => {
  try {
    const response = await getWalletTransactions();

    // Kiểm tra status code (ví dụ: nếu không phải 200 thì ném lỗi)
    if (response.status !== 200) {
      throw new Error(`Unexpected status code: ${response.status}`);
    }

    return response.data; // Trả về dữ liệu từ response nếu không có lỗi
  } catch (error) {
    // Bắt lỗi nếu có (ví dụ: mạng lỗi, hoặc status code khác ngoài 200)
    console.error("Error fetching data:", error);
    throw error; // Để SWR có thể xử lý lỗi
  }
};

const PAGE_SIZE = 10;

export function useWalletTransactions(
  page: number,
  limit: number,
  filters?: any,
) {
  const getKey = () => {
    const params = new URLSearchParams({
      skip: (page * PAGE_SIZE).toString(),
      limit: PAGE_SIZE.toString(),
      ...(filters?.status ? { status: filters.status } : {}),
      ...(filters?.type ? { type: filters.type } : {}),
    });

    return `/wallet/transactions?${params.toString()}`;
  };

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    getKey(),
    fetcher,
  );

  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
  };
}
