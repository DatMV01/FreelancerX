'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type Transaction = {
  id: string;
  referenceCode: string | null;
  amount: number;
  direction: 'IN' | 'OUT';
  method?: string;
  type: string;
  status: string;
  freelancerId: string;
  orderId?: string;
  metadata?: Record<string, any>;
  currency: string;
  createdAt: string;
};

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function TransactionList() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading } = useSWR(
    `/api/freelancer/transactions?page=${page}&pageSize=${pageSize}`,
    fetcher,
    { keepPreviousData: true }
  );

  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-500">
        Loading transactions...
      </div>
    );
  }

  const transactions: Transaction[] = data?.items ?? [];

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Direction</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <TableRow key={tx.id} className="hover:bg-muted/50">
                  <TableCell>{tx.referenceCode || '-'}</TableCell>
                  <TableCell>${tx.amount.toFixed(2)}</TableCell>
                  <TableCell>{tx.direction}</TableCell>
                  <TableCell>{tx.method || '-'}</TableCell>
                  <TableCell>{tx.type}</TableCell>
                  <TableCell>
                    <span
                      className={
                        tx.status === 'COMPLETED'
                          ? 'text-green-600 font-semibold'
                          : tx.status === 'FAILED'
                          ? 'text-red-600 font-semibold'
                          : tx.status === 'PENDING'
                          ? 'text-yellow-600 font-semibold'
                          : ''
                      }
                    >
                      {tx.status}
                    </span>
                  </TableCell>
                  <TableCell>{tx.currency}</TableCell>
                  <TableCell>{new Date(tx.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-gray-500">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          Page {page} of {data?.totalPages ?? 1}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (!data?.totalPages) return;
              if (page < data.totalPages) setPage((prev) => prev + 1);
            }}
            disabled={page === data?.totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
