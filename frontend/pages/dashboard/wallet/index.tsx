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
import { WalletTransactionEntity } from "@/features/wallet/wallet.type";
import { useQuerySync } from "@/hooks/useQuerySync";
import { selectUser } from "@/lib/redux/features/auth/authSlice";
import { useAppSelector } from "@/lib/redux/hooks";
import { RefreshCcw } from "lucide-react";
import { ReactElement, useState } from "react";
import { toast } from "sonner";

function WalletDashboard() {
  const [openWithdraw, setOpenWithdraw] = useState(false);
  const [year, setYear] = useState(2025);

  const { query, queryString, setQuery, resetQuery } =
    useQuerySync<WalletTransactionEntity>(defaultWalletTransactionQuery);

  const {
    data: wallet,
    error: errorWallet,
    isLoading: isLoadingWallet,
    isValidating: isValidatingWallet,
    mutate: mutateWallet,
  } = useGetWalletInfo();

  const {
    data: earningsData,
    isLoading: isLoadingEarnings,
    isValidating: isValidatingEarnings,
    mutate: mutateEarnings,
    error: errorEarnings,
  } = useGetEarningsDataByYear(year);

  const {
    data: walletTransactions,
    isLoading: isLoadingTransactions,
    isValidating: isValidatingTransactions,
    mutate: mutateWalletTransactions,
    error: errorWalletTransactions,
  } = useGetWalletTransactions(queryString);

  const handleWithdrawSubmit = async (form: any) => {
    try {
      await requestWithdraw(form);

      mutateWallet();
      mutateWalletTransactions();
    } catch (error) {
      console.error(error);
      toast.error("Failed to withdraw");
    }
  };

  const mutateAll = () => {
    mutateWallet();
    mutateWalletTransactions();
    mutateEarnings();
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
      <div className="flex gap-x-4">
        <div className="flex-2 pt-14">
          <WalletInfo
            mutate={mutateWallet}
            wallet={wallet}
            isLoading={isLoadingWallet || isValidatingWallet}
            setOpenWithdrawCb={setOpenWithdraw}
          />
        </div>

        <div className="flex-10">
          <WalletChart
            dataByYear={earningsData}
            isLoading={isLoadingEarnings || isValidatingEarnings}
            setYearCb={(year: string) => setYear(Number(year))}
            mutate={mutateEarnings}
          />
        </div>
      </div>

      <WalletTransactionTable
        response={walletTransactions}
        isLoading={isLoadingTransactions || isValidatingTransactions}
        error={errorWalletTransactions}
        mutate={mutateWalletTransactions}
      />

      <WithdrawModal
        open={openWithdraw}
        onClose={() => setOpenWithdraw(false)}
        onSubmit={handleWithdrawSubmit}
        availableBalance={wallet?.availableBalance}
      />
    </DashboardMainContent>
  );
}

WalletDashboard.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout2>{page}</DashboardLayout2>;
};

export default WalletDashboard;
