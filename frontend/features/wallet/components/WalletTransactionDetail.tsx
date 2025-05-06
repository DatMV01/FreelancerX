"use client";

import CircularProgressCenter from "@/components/CircularProgressCenter";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Decimal from "decimal.js";
import { CheckCircle, RefreshCcw, XCircle } from "lucide-react";
import { useGetWalletTransaction } from "../hooks/useGetWalletTransaction";
import {
  ActorType,
  TransactionStatus,
  TransactionType,
  WalletTransactionEntity,
} from "../wallet.type";
import { WalletTransactionMethodBadge } from "./WalletTransactionMethodBadge";
import { WalletTransactionStatusBadge } from "./WalletTransactionStatusBadge";
import { WalletTransactionTypeBadge } from "./WalletTransactionTypeBadge";
import { WalletTransationStatusButtonAdmin } from "./WalletTransationStatusButtonAdmin";
import { useState } from "react";
import ApproveEarningDialog from "./ApproveEarningDialog";
import { toast } from "sonner";
import RejectEarningDialog from "./RejectEarningDialog";
import ApproveWithdrawDialog from "./ApproveWithdrawDialog";
import RejectWithdrawDialog from "./RejectWithdrawDialog";
import {
  approvePendingEarning,
  approveWithdraw,
  rejectWithdraw,
} from "../wallet.api";

type Props = {
  transaction: WalletTransactionEntity;
  actorType?: ActorType;
  mutateAllTransactions: any;
};

export function WalletTransactionDetail({
  transaction,
  actorType,
  mutateAllTransactions,
}: Props) {
  const [approveWithdrawDialogOpen, setApproveWithdrawDialogOpen] =
    useState(false);
  const [rejectWithdrawDialogOpen, setRejectWithdrawDialogOpen] =
    useState(false);
  const [approveEarningDialogOpen, setApproveEarningDialogOpen] =
    useState(false);
  const [rejectEarningDialogOpen, setRejectEarningDialogOpen] = useState(false);

  const [processing, setProcessing] = useState(false);

  const {
    data: walletTransaction,
    isLoading: isLoadingTransaction,
    isValidating: isValidatingTransaction,
    error: errorWalletTransaction,
    mutate: mutateWalletTransaction,
  } = useGetWalletTransaction(transaction.id);

  if (isLoadingTransaction || isValidatingTransaction) {
    return <CircularProgressCenter />;
  }

  return (
    <div className="flex h-full flex-col items-center justify-between gap-y-2 px-4">
      <div className="w-full rounded-xs p-2">
        <div className="text-muted-foreground space-y-4 text-sm">
          <div className="flex justify-between">
            <span>Id</span>
            <span>{walletTransaction.id}</span>
          </div>

          <div className="flex justify-between">
            <span>ReferenceCode</span>
            <span>{walletTransaction.referenceCode}</span>
          </div>

          <div className="flex justify-between">
            <span>Amount</span>
            <span className="font-bold text-black">
              {new Decimal(walletTransaction.amount).toFixed(2)}{" "}
              {walletTransaction.currency}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Type</span>
            <WalletTransactionTypeBadge type={walletTransaction.type} />
          </div>
          <div className="flex justify-between">
            <span>Status</span>
            <WalletTransactionStatusBadge status={walletTransaction.status} />
          </div>
          {walletTransaction?.metadata?.reason && (
            <div className="flex justify-between">
              <span>Reason</span>
              <span>{walletTransaction.metadata.reason}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Method</span>
            <WalletTransactionMethodBadge method={walletTransaction.method} />
          </div>
          <div className="flex justify-between">
            <span>Actor</span>
            <span>{walletTransaction.actorType}</span>
          </div>
          <div className="flex justify-between">
            <span>Description</span>
            <span>{walletTransaction.description}</span>
          </div>
          <div className="flex justify-between">
            <span>Balance Before</span>
            <span>
              {new Decimal(walletTransaction.balanceBefore).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Balance After</span>
            <span>
              {new Decimal(walletTransaction.balanceAfter).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Created At</span>
            <span>
              {format(
                new Date(walletTransaction.createdAt),
                "dd/MM/yyyy HH:mm",
              )}
            </span>
          </div>
          {walletTransaction.processedAt && (
            <div className="flex justify-between">
              <span>Processed At</span>
              <span>
                {format(
                  new Date(walletTransaction.processedAt),
                  "dd/MM/yyyy HH:mm",
                )}
              </span>
            </div>
          )}
          {walletTransaction.processedBy && (
            <div className="flex justify-between">
              <span>Processed By</span>
              <span>ADMIN</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-x-2">
        <WalletTransationStatusButtonAdmin
          status={walletTransaction.status}
          type={walletTransaction.type}
          onApproveWithdraw={() => {
            setApproveWithdrawDialogOpen(true);
          }}
          onRejectWithdraw={() => {
            setRejectWithdrawDialogOpen(true);
          }}
          onApproveEarning={() => {
            setApproveEarningDialogOpen(true);
          }}
          onRejectEarning={() => {
            setRejectEarningDialogOpen(true);
          }}
          onRefresh={() => {
            mutateWalletTransaction();
          }}
        />
      </div>

      <>
        <ApproveWithdrawDialog
          open={approveWithdrawDialogOpen}
          onOpenChange={setApproveWithdrawDialogOpen}
          processing={processing}
          onConfirm={async () => {
            setProcessing(true);

            try {
              const response = await approveWithdraw(walletTransaction.id);

              if (response.status === 200) {
                mutateWalletTransaction();
                mutateAllTransactions && mutateAllTransactions();
              }
            } catch (error) {
              toast.error("ApproveWithdrawDialog Error");
            } finally {
              setApproveWithdrawDialogOpen(false);
              setProcessing(false);
            }
          }}
        />

        <RejectWithdrawDialog
          open={rejectWithdrawDialogOpen}
          onOpenChange={setRejectWithdrawDialogOpen}
          processing={processing}
          onReject={async (reason) => {
            setProcessing(true);

            try {
              const response = await rejectWithdraw(
                walletTransaction.id,
                reason,
              );

              if (response.status === 200) {
                mutateWalletTransaction();
                mutateAllTransactions && mutateAllTransactions();
              }
            } catch (error) {
              toast.error("RejectWithdrawDialog Error");
            } finally {
              setRejectWithdrawDialogOpen(false);
              setProcessing(false);
            }
          }}
        />

        <ApproveEarningDialog
          open={approveEarningDialogOpen}
          onOpenChange={setApproveEarningDialogOpen}
          processing={processing}
          onConfirm={async () => {
            setProcessing(true);

            try {
              const response = await approvePendingEarning(
                walletTransaction.id,
              );

              if (response.status === 200) {
                mutateWalletTransaction();
                mutateAllTransactions && mutateAllTransactions();
              }
            } catch (error) {
              toast.error("ApproveEarningDialog Error");
            } finally {
              setApproveEarningDialogOpen(false);
              setProcessing(false);
            }
          }}
        />

        {/* <RejectEarningDialog
          open={rejectEarningDialogOpen}
          onOpenChange={setRejectEarningDialogOpen}
          processing={processing}
          onReject={(reason) => toast.info(reason)}
        /> */}
      </>
    </div>
  );
}
