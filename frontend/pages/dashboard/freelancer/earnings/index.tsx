import DashboardLayout from "@/components/layouts/DashboardLayout";
import { WalletSummary } from "@/features/dashboard/freelancer/components/WalletSummary";
import { WithdrawModal } from "@/features/dashboard/freelancer/components/WithdrawModal";

import { ChartEarnings } from "@/features/dashboard/freelancer/components/ChartEarnings";
import { faker } from "@faker-js/faker";
import { ReactElement, useEffect, useState } from "react";
import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";
import { toast } from "sonner";
import { TransactionList } from "@/features/dashboard/freelancer/components/TransactionList";
import {
  fetchFreelancerTransactions,
  getEarningByYear,
  getWalletByUserId,
} from "@/features/transactions/transactions.api";
import useSWR from "swr";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectUser } from "@/lib/redux/features/auth/authSlice";

const earningsDataByYear = {
  "2024": [
    { month: "Jan", totalEarnings: 1200, totalWithdrawals: 300 },
    { month: "Feb", totalEarnings: 950, totalWithdrawals: 250 },
    { month: "Mar", totalEarnings: 1100, totalWithdrawals: 400 },
    { month: "Apr", totalEarnings: 1500, totalWithdrawals: 600 },
    { month: "May", totalEarnings: 1700, totalWithdrawals: 550 },
    { month: "Jun", totalEarnings: 1300, totalWithdrawals: 400 },
    { month: "Jul", totalEarnings: 1400, totalWithdrawals: 300 },
    { month: "Aug", totalEarnings: 1800, totalWithdrawals: 450 },
    { month: "Sep", totalEarnings: 1600, totalWithdrawals: 500 },
    { month: "Oct", totalEarnings: 1750, totalWithdrawals: 600 },
    { month: "Nov", totalEarnings: 1900, totalWithdrawals: 700 },
    { month: "Dec", totalEarnings: 2000, totalWithdrawals: 800 },
  ],
  "2025": [
    { month: "Jan", totalEarnings: 1000, totalWithdrawals: 200 },
    { month: "Feb", totalEarnings: 1200, totalWithdrawals: 250 },
    { month: "Mar", totalEarnings: 1300, totalWithdrawals: 300 },
    { month: "Apr", totalEarnings: 1700, totalWithdrawals: 400 },
    { month: "May", totalEarnings: 1900, totalWithdrawals: 500 },
    { month: "Jun", totalEarnings: 2000, totalWithdrawals: 550 },
    { month: "Jul", totalEarnings: 2200, totalWithdrawals: 600 },
    { month: "Aug", totalEarnings: 2100, totalWithdrawals: 550 },
    { month: "Sep", totalEarnings: 2300, totalWithdrawals: 600 },
    { month: "Oct", totalEarnings: 2500, totalWithdrawals: 700 },
    { month: "Nov", totalEarnings: 2700, totalWithdrawals: 800 },
    { month: "Dec", totalEarnings: 3000, totalWithdrawals: 900 },
  ],
};

function FreelancerDashboardEarnings() {
  const [openWithdraw, setOpenWithdraw] = useState(false);
  const [page, setPage] = useState(1);
  const [year, setYear] = useState(2025);

  const user = useAppSelector(selectUser);
  const freelancerId = user?.freelancer?.id;

  const {
    data: wallet,
    error: errorWallet,
    isLoading: isLoadingWallet,
    isValidating: isValidatingWallet,
    mutate: mutateWallet,
  } = useSWR(
    freelancerId ? `/transaction/wallet/${freelancerId}` : null,
    () => freelancerId && getWalletByUserId(freelancerId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
      dedupingInterval: 0,
    },
  );

  const {
    data: dataTransactions,
    error: errorTransactions,
    isLoading: isLoadingTransactions,
    isValidating: isValidatingTransactions,
    mutate: mutateTransactions,
  } = useSWR(
    freelancerId ? `/transaction/freelancer/${freelancerId}` : null,

    () => fetchFreelancerTransactions({ page }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 0,
      refreshInterval: 0,
      keepPreviousData: true,
    },
  );

  const {
    data: earnings,
    error: errorEarnings,
    isLoading: isLoadingEarnings,
    isValidating: isValidatingEarnings,
    mutate: mutateEarnings,
  } = useSWR(
    freelancerId ? `/transaction/earnings/${freelancerId}` : null,
    () => freelancerId && getEarningByYear(year),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
      dedupingInterval: 0,
    },
  );

  const handleWithdrawSubmit = async (form: any) => {
    try {
      const res = await axiosInstanceV1.post(
        "/transaction/withdrawal-request",
        form,
      );

      toast.info("Withdraw request created!");

      mutateWallet();
      mutateTransactions();
    } catch (error) {
      console.error(error);
      toast.error("Failed to withdraw");
    }
  };

  //transaction/earnings/2025

  return (
    <div className="flex flex-col space-y-6">
      <h1 className="rounded-md border border-green-500 p-4 text-center text-2xl font-bold text-green-500">
        Earnings
      </h1>

      <div className="grid grid-cols-3 gap-x-6">
        <div className="col-span-1">
          <WalletSummary
            mutate={mutateWallet}
            wallet={wallet}
            isLoading={isLoadingWallet || isValidatingWallet}
            setOpenWithdrawCb={setOpenWithdraw}
          />
        </div>
        <div className="col-span-2">
          <ChartEarnings
            dataByYear={earnings}
            isLoading={isLoadingEarnings || isValidatingEarnings}
            setYearCb={setYear}
          />
        </div>
      </div>

      <TransactionList
        data={dataTransactions}
        mutate={mutateTransactions}
        isLoading={isLoadingTransactions || isValidatingTransactions}
        setPage={setPage}
      />

      <WithdrawModal
        open={openWithdraw}
        onClose={() => setOpenWithdraw(false)}
        onSubmit={handleWithdrawSubmit}
        availableBalance={wallet?.availableBalance}
      />

      {/* <PaymentMethodForm /> */}
      {/* <FreelancerEarningsStats /> */}
    </div>
  );
}

FreelancerDashboardEarnings.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default FreelancerDashboardEarnings;
