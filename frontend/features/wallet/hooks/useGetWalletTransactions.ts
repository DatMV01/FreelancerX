import { useFetchByQuery } from "@/hooks/useFetch";
import { QueryInput } from "@/lib/fitlers/buildQueryFromObject";
import { fetchWalletTransactions } from "../wallet.api";
import { WalletTransactionEntity } from "../wallet.type";

export const defaultWalletTransactionQuery: QueryInput<WalletTransactionEntity> =
  {
    page: 1,
    pageSize: 10,
    sorts: { processedAt: "DESC", createdAt: "DESC" },
  } as any;

export function useGetWalletTransactions(
  queryString: string,
  swrOptions?: any,
) {
  return useFetchByQuery(queryString, fetchWalletTransactions, swrOptions);
}
