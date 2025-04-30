import { useState } from "react";
import { useWalletTransactions } from "../hooks/useWalletTransactions";

export default function WalletTransactionsPage() {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);

  const { data, isLoading, error } = useWalletTransactions(page, limit);

  const totalPages = Math.ceil(1 / 1);

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading transactions</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Wallet Transactions</h1>

      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">ID</th>
            <th className="p-2">Type</th>
            <th className="p-2">Status</th>
            <th className="p-2 text-right">Amount</th>
            <th className="p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {data?.data.map((txn: any) => (
            <tr key={txn.id} className="border-t">
              <td className="p-2">{txn.id}</td>
              <td className="p-2">{txn.type}</td>
              <td className="p-2">{txn.status}</td>
              <td className="p-2 text-right">${txn.amount}</td>
              <td className="p-2">
                {new Date(txn.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center pt-4">
        <div className="flex items-center justify-between pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
