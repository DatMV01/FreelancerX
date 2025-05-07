import { useFetchV1 } from "@/hooks/useFetch";
import { walletUrl } from "../wallet.api";

export function useGetWalletInfo(swrOptions?: any) {
  return useFetchV1(walletUrl.info, swrOptions);
}
