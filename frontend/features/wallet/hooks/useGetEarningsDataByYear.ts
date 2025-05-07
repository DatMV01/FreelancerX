
import { useFetchV1 } from "@/hooks/useFetch";
import {
  walletUrl
} from "../wallet.api";

export function useGetEarningsDataByYear(year: number, swrOptions?: any) {
  return useFetchV1(walletUrl.earningsByYear(String(year)), swrOptions);
}
