import { useFetchV1 } from "@/hooks/useFetch";
import { walletUrl } from "../wallet.api";

export function useGetWalletTransaction(
  transactionId: string,
  swrOptions?: any,
) {
  return useFetchV1(walletUrl.transaction(transactionId), swrOptions);
}
