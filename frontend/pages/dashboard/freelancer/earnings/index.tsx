import DashboardLayout from "@/components/layouts/DashboardLayout";
import { WalletSummary } from "@/features/dashboard/freelancer/components/WalletSummary";
import { WithdrawModal } from "@/features/dashboard/freelancer/components/WithdrawModal";

import { ChartEarnings } from "@/features/dashboard/freelancer/components/ChartEarnings";
import { TransactionList } from "@/features/dashboard/freelancer/components/TransactionList";
import { faker } from "@faker-js/faker";
import { ReactElement, useEffect, useState } from "react";

export const fakeTransactions = Array.from({ length: 42 }).map((_, idx) => ({
  id: faker.string.uuid(),
  amount: faker.number.float({ min: 10, max: 500, fractionDigits: 2 }),
  type: faker.helpers.arrayElement(["earning", "withdrawal"]),
  status: faker.helpers.arrayElement(["pending", "completed", "rejected"]),
  createdAt: faker.date.past({ years: 1 }).toISOString(),
  referenceCode: faker.string.alphanumeric(8).toUpperCase(),
  currency: "USD",
}));

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

  const [transactions, setTransactions] = useState();

  useEffect(() => {
    setTransactions(fakeTransactions);
  }, []);
  const [summary, setSummary] = useState({
    availableBalance: 400.25,
    pendingBalance: 120.5,
  });
  const handleWithdrawSubmit = async (amount: number, method: string) => {
    try {
      await fetch("/api/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, method }),
      });
      alert("Withdraw request created!");
    } catch (error) {
      console.error(error);
      alert("Failed to withdraw");
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <h1 className="rounded-md border border-green-500 p-4 text-center text-2xl font-bold text-green-500">
        Earnings
      </h1>
      <div className="grid grid-cols-3 gap-x-6">
        <div className="col-span-1">
          <WalletSummary setOpenWithdrawCb={setOpenWithdraw} />
        </div>
        <div className="col-span-2">
          <ChartEarnings dataByYear={earningsDataByYear} />
        </div>
      </div>

      {transactions && (
        <TransactionList transactions={transactions} isLoading={false} />
      )}

      <WithdrawModal
        open={openWithdraw}
        onClose={() => setOpenWithdraw(false)}
        onSubmit={handleWithdrawSubmit}
        availableBalance={summary.availableBalance}
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
