import DashboardLayout2 from "@/components/layouts/DashboardLayout2";
import { Button } from "@/components/ui/button";
import {
  DashboardMainContent,
  DashboardMainContentHeader,
} from "@/features/dashboard/components/DashboardMainContent";
import WithdrawModal from "@/features/dashboard/freelancer/components/WithdrawModal";
import { WalletChart } from "@/features/wallet/components/WalletChart";
import WalletInfo from "@/features/wallet/components/WalletInfo";
import WalletTransactionTable from "@/features/wallet/components/WalletTransactionTable";
import { useGetEarningsDataByYear } from "@/features/wallet/hooks/useGetEarningsDataByYear";
import { useGetWalletInfo } from "@/features/wallet/hooks/useGetWalletInfo";
import {
  defaultWalletTransactionQuery,
  useGetWalletTransactions,
} from "@/features/wallet/hooks/useGetWalletTransactions";
import { requestWithdraw } from "@/features/wallet/wallet.api";
import { ActorType, WalletTransactionEntity } from "@/features/wallet/wallet.type";
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

  const { query, queryString, setQuery, resetQuery } =
    useQuerySync<WalletTransactionEntity>(defaultWalletTransactionQuery);

  const {
    data: walletTransactions,
    isLoading: isLoadingTransactions,
    isValidating: isValidatingTransactions,
    error: errorWalletTransactions,
    mutate: mutateWalletTransactions,
  } = useGetWalletTransactions(queryString);

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
