import DashboardLayout2 from "@/components/layouts/DashboardLayout2";
import { Button } from "@/components/ui/button";
import {
  DashboardMainContent,
  DashboardMainContentHeader,
} from "@/features/dashboard/components/DashboardMainContent";
import WalletTransactionTable from "@/features/wallet/components/WalletTransactionTable";
import {
  defaultWalletTransactionQuery
} from "@/features/wallet/hooks/useGetWalletTransactions";
import {
  fetchWalletTransactions,
  requestWithdraw,
} from "@/features/wallet/wallet.api";
import {
  ActorType,
  WalletTransactionEntity,
} from "@/features/wallet/wallet.type";
import { useFetchByQuery } from "@/hooks/useFetch";
import { useQuerySync } from "@/hooks/useQuerySync";
import { selectUser } from "@/lib/redux/features/auth/authSlice";
import { useAppSelector } from "@/lib/redux/hooks";
import { RefreshCcw } from "lucide-react";
import { ReactElement, useState } from "react";
import { toast } from "sonner";

function AdminTransactionsDashboard() {
  const [openWithdraw, setOpenWithdraw] = useState(false);
  const [year, setYear] = useState(2025);

  const user = useAppSelector(selectUser);
  const userId = user?.id || "";

  const { query, queryString, url, setQuery, resetQuery } =
    useQuerySync<WalletTransactionEntity>(defaultWalletTransactionQuery);

  const {
    data: walletTransactions,
    isLoading: isLoadingTransactions,
    isValidating: isValidatingTransactions,
    error: errorWalletTransactions,
    mutate: mutateWalletTransactions,
  } = useFetchByQuery({
    queryString,
    fetcherFn: fetchWalletTransactions,
    key: url,
  });

  const handleWithdrawSubmit = async (form: any) => {
    try {
      await requestWithdraw(form);

      mutateWalletTransactions();
    } catch (error) {
      console.error(error);
      toast.error("Failed to withdraw");
    }
  };

  const mutateAll = () => {
    mutateWalletTransactions();
  };

  return (
    <DashboardMainContent>
      <DashboardMainContentHeader>
        <p> Wallet</p>
        <Button
          variant="outline"
          onClick={() => {
            mutateAll();
          }}
        >
          <RefreshCcw />
        </Button>
      </DashboardMainContentHeader>

      <WalletTransactionTable
        response={walletTransactions}
        isLoading={isLoadingTransactions || isValidatingTransactions}
        error={errorWalletTransactions}
        mutate={mutateWalletTransactions}
        actorType={ActorType.ADMIN}
      />
    </DashboardMainContent>
  );
}

AdminTransactionsDashboard.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout2>{page}</DashboardLayout2>;
};

export default AdminTransactionsDashboard;
