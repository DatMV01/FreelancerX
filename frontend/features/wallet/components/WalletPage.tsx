import { useState } from "react";
import useSWR from "swr";
import { selectUser } from "@/lib/redux/features/auth/authSlice";
import { useAppSelector } from "@/lib/redux/hooks";
import {
  getWalletInfo,
  getWalletTransactions,
  requestWithdraw,
} from "../wallet.api";
import { toast } from "sonner";
import { WalletSummary } from "@/features/wallet/components/WalletSummary";
import WithdrawModal from "@/features/dashboard/freelancer/components/WithdrawModal";
import WalletInfo from "./WalletInfo";
import { ChartEarnings } from "@/features/dashboard/freelancer/components/ChartEarnings";
import WalletTransactions from "./WalletTransactions";
import { WalletChart } from "./WalletChart";

const demoTransactions = [
  {
    id: "1",
    type: "DEPOSIT",
    amount: 100,
    currency: "USD",
    method: "BANK",
    status: "SUCCESS",
    createdAt: "2025-04-28T12:00:00Z",
    description: "Nạp tiền qua ngân hàng",
  },
  {
    id: "2",
    type: "WITHDRAW",
    amount: 50,
    currency: "USD",
    method: "MOMO",
    status: "PENDING",
    createdAt: "2025-04-28T14:00:00Z",
    description: "Rút về ví MoMo",
  },
];

const transactions = [
  {
    id: "tx1",
    walletId: "wallet123",
    type: "DEPOSIT",
    status: "COMPLETED",
    amount: 150.0,
    actorType: "FREELANCER",
    actorId: "actor123",
    referenceCode: "ORD123",
    balanceBefore: 50.0,
    balanceAfter: 200.0,
    method: "paypal",
    metadata: { paypalId: "xyz789" },
    description: "Deposit from PayPal",
    currency: "USD",
    createdAt: new Date("2024-03-01T10:15:00Z"),
    approvedAt: new Date("2024-03-01T10:20:00Z"),
    rejectedAt: null,
  },
  {
    id: "tx2",
    walletId: "wallet123",
    type: "WITHDRAW",
    status: "PENDING",
    amount: 100.0,
    actorType: "FREELANCER",
    actorId: "actor123",
    referenceCode: "WD123",
    balanceBefore: 200.0,
    balanceAfter: 100.0,
    method: "bank",
    metadata: { bankName: "ABC Bank" },
    description: "Withdraw to bank account",
    currency: "USD",
    createdAt: new Date("2024-04-15T08:00:00Z"),
    approvedAt: null,
    rejectedAt: null,
  },
  {
    id: "tx3",
    walletId: "wallet123",
    type: "TRANSFER",
    status: "FAILED",
    amount: 20.5,
    actorType: "BUYER",
    actorId: "actor999",
    referenceCode: "TRF123",
    balanceBefore: 100.0,
    balanceAfter: 79.5,
    method: "stripe",
    metadata: {},
    description: "Transfer to another user",
    currency: "USD",
    createdAt: new Date("2024-04-20T18:30:00Z"),
    approvedAt: null,
    rejectedAt: new Date("2024-04-20T18:35:00Z"),
  },
];

const dataByYear = {
  "2024": [
    { month: "Jan", totalEarnings: 3200, totalWithdrawals: 1500, refund: 200 },
    { month: "Feb", totalEarnings: 2900, totalWithdrawals: 1400, refund: 100 },
    { month: "Mar", totalEarnings: 3400, totalWithdrawals: 1600, refund: 150 },
    { month: "Apr", totalEarnings: 3100, totalWithdrawals: 1700, refund: 50 },
    { month: "May", totalEarnings: 3600, totalWithdrawals: 1800, refund: 250 },
    { month: "Jun", totalEarnings: 4000, totalWithdrawals: 2000, refund: 300 },
    { month: "Jul", totalEarnings: 4200, totalWithdrawals: 1900, refund: 180 },
    { month: "Aug", totalEarnings: 3900, totalWithdrawals: 1700, refund: 100 },
    { month: "Sep", totalEarnings: 3700, totalWithdrawals: 1600, refund: 90 },
    { month: "Oct", totalEarnings: 4100, totalWithdrawals: 2000, refund: 130 },
    { month: "Nov", totalEarnings: 4300, totalWithdrawals: 2100, refund: 110 },
    { month: "Dec", totalEarnings: 4500, totalWithdrawals: 2200, refund: 300 },
  ],
};

export default function WalletPage() {
  const [openWithdraw, setOpenWithdraw] = useState(false);
  const [year, setYear] = useState(2024);
  const [page, setPage] = useState(1);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // Số giao dịch mỗi trang

  // Giả lập fetch API, sử dụng dữ liệu demo
  const totalTransactions = demoTransactions.length;
  const startIdx = (currentPage - 1) * pageSize;
  const transactionsToDisplay = demoTransactions.slice(
    startIdx,
    startIdx + pageSize,
  );

  const user = useAppSelector(selectUser);
  const userId = user?.id || "";

  const {
    data: wallet,
    error: errorWallet,
    isLoading: isLoadingWallet,
    isValidating: isValidatingWallet,
    mutate: mutateWallet,
  } = useSWR(
    userId ? `/wallet/${userId}` : null,
    () => userId && getWalletInfo(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
      dedupingInterval: 0,
    },
  );

  const {
    data: walletTransactions,
    error: errorTransactions,
    isLoading: isLoadingTransactions,
    isValidating: isValidatingTransactions,
    mutate: mutateTransactions,
  } = useSWR(
    userId ? `/wallet/${userId}/transaction` : null,
    () => getWalletTransactions(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 0,
      refreshInterval: 0,
      keepPreviousData: true,
    },
  );

  const handleWithdrawSubmit = async (form: any) => {
    try {
      const res = await requestWithdraw(form);

      toast.info("Withdraw request created!");

      mutateWallet();
      //  mutateTransactions();
    } catch (error) {
      console.error(error);
      toast.error("Failed to withdraw");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  console.log(wallet);

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex gap-x-4">
        <div className="flex-2">
          <WalletInfo
            mutate={mutateWallet}
            wallet={wallet}
            isLoading={isLoadingWallet || isValidatingWallet}
            setOpenWithdrawCb={setOpenWithdraw}
          />
        </div>
        <div className="flex-10">
          <WalletChart
            dataByYear={dataByYear}
            isLoading={isLoadingTransactions || isValidatingTransactions}
            setYearCb={(year: string) => setYear(Number(year))}
          />
        </div>
      </div>

      <WalletTransactions
        data={walletTransactions}
        isLoading={isLoadingTransactions || isValidatingTransactions}
      />

      <WithdrawModal
        open={openWithdraw}
        onClose={() => setOpenWithdraw(false)}
        onSubmit={handleWithdrawSubmit}
        availableBalance={wallet?.availableBalance}
      />
    </div>
  );
}
