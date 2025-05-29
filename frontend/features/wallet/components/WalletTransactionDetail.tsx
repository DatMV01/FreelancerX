"use client";

import { useState } from "react";
import Decimal from "decimal.js";
import { format } from "date-fns";
import { toast } from "sonner";
import CircularProgressCenter from "@/components/CircularProgressCenter";
import { Button } from "@/components/ui/button";
import { ActorType, WalletTransactionEntity } from "../wallet.type";
import {
  approvePendingEarning,
  approveWithdraw,
  rejectWithdraw,
} from "../wallet.api";
import { useGetWalletTransaction } from "../hooks/useGetWalletTransaction";
import { WalletTransactionTypeBadge } from "./WalletTransactionTypeBadge";
import { WalletTransactionStatusBadge } from "./WalletTransactionStatusBadge";
import { WalletTransactionMethodBadge } from "./WalletTransactionMethodBadge";
import { WalletTransationStatusButtonAdmin } from "./WalletTransationStatusButtonAdmin";
import ApproveWithdrawDialog from "./ApproveWithdrawDialog";
import RejectWithdrawDialog from "./RejectWithdrawDialog";
import ApproveEarningDialog from "./ApproveEarningDialog";
import { AxiosResponse } from "axios";

type Props = {
  transaction: WalletTransactionEntity;
  actorType?: ActorType;
  mutateAllTransactions: () => void;
};

export function WalletTransactionDetail({
  transaction,
  actorType,
  mutateAllTransactions,
}: Props) {
  const [dialogs, setDialogs] = useState({
    approveWithdraw: false,
    rejectWithdraw: false,
    approveEarning: false,
    rejectEarning: false,
  });

  const [processing, setProcessing] = useState(false);

  const {
    data: walletTransaction,
    isLoading,
    isValidating,
    mutate: mutateWalletTransaction,
  } = useGetWalletTransaction(transaction.id);

  const toggleDialog = (key: keyof typeof dialogs, value: boolean) => {
    setDialogs((prev) => ({ ...prev, [key]: value }));
  };

  const handleApprove = async (
    action: () => Promise<AxiosResponse>,
    dialogKey: keyof typeof dialogs,
  ) => {
    setProcessing(true);
    try {
      const res = await action();
      if (res.status === 200) {
        mutateWalletTransaction();
        mutateAllTransactions();
      }
    } catch {
      toast.error(`${dialogKey} Error`);
    } finally {
      toggleDialog(dialogKey, false);
      setProcessing(false);
    }
  };

  const handleReject = async (
    action: (id: string, reason: string) => Promise<AxiosResponse>,
    dialogKey: keyof typeof dialogs,
    reason: string,
  ) => {
    setProcessing(true);
    try {
      const res = await action(walletTransaction.id, reason);
      if (res.status === 200) {
        mutateWalletTransaction();
        mutateAllTransactions();
      }
    } catch {
      toast.error(`${dialogKey} Error`);
    } finally {
      toggleDialog(dialogKey, false);
      setProcessing(false);
    }
  };

  if (isLoading || isValidating) return <CircularProgressCenter />;

  const details = [
    { label: "Id", value: walletTransaction.id },
    { label: "ReferenceCode", value: walletTransaction.referenceCode },
    {
      label: "Amount",
      value: `${new Decimal(walletTransaction.amount).toFixed(2)} ${walletTransaction.currency}`,
      bold: true,
    },
    {
      label: "Type",
      value: <WalletTransactionTypeBadge type={walletTransaction.type} />,
    },
    {
      label: "Status",
      value: <WalletTransactionStatusBadge status={walletTransaction.status} />,
    },
    walletTransaction.metadata?.reason && {
      label: "Reason",
      value: walletTransaction.metadata.reason,
    },
    {
      label: "Method",
      value: <WalletTransactionMethodBadge method={walletTransaction.method} />,
    },
    { label: "Actor", value: walletTransaction.actorType },
    { label: "Description", value: walletTransaction.description },
    {
      label: "Balance Before",
      value: `${new Decimal(walletTransaction.balanceBefore).toFixed(2)} ${walletTransaction.currency}`,
    },
    {
      label: "Balance After",
      value: `${new Decimal(walletTransaction.balanceAfter).toFixed(2)} ${walletTransaction.currency}`,
    },
    {
      label: "Created At",
      value: format(new Date(walletTransaction.createdAt), "dd/MM/yyyy HH:mm"),
    },










    
 
    walletTransaction.metadata?.bankInfo && {
      label: "Bank Name",
      value: walletTransaction.metadata.bankInfo.bankName,
    },
    walletTransaction.metadata?.bankInfo && {
      label: "SWIFTCODE",
      value: walletTransaction.metadata.bankInfo.swiftCode,
    },
    walletTransaction.metadata?.bankInfo && {
      label: "Account Number",
      value: walletTransaction.metadata.bankInfo.accountNumber,
    },
    walletTransaction.metadata?.bankInfo && {
      label: "Account HolderName",
      value: walletTransaction.metadata.bankInfo.accountHolderName,
    },
    walletTransaction.processedAt && {
      label: "Processed At",
      value: format(
        new Date(walletTransaction.processedAt),
        "dd/MM/yyyy HH:mm",
      ),
    },
    walletTransaction.processedBy && {
      label: "Processed By",
      value: "ADMIN",
    },
  ].filter(Boolean);

  return (
    <div className="flex h-full flex-col   px-4">
      <div className="text-muted-foreground h-full space-y-4 overflow-y-auto rounded-xs p-2 text-sm">
        {details.map((item, index) => (
          <div key={index} className="flex justify-between">
            <span>{item.label}</span>
            <span className={item.bold ? "font-bold text-black" : ""}>
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {actorType === ActorType.ADMIN && (
        <div className="flex items-center justify-center gap-x-2">
          <WalletTransationStatusButtonAdmin
            status={walletTransaction.status}
            type={walletTransaction.type}
            onApproveWithdraw={() => toggleDialog("approveWithdraw", true)}
            onRejectWithdraw={() => toggleDialog("rejectWithdraw", true)}
            onApproveEarning={() => toggleDialog("approveEarning", true)}
            onRejectEarning={() => toggleDialog("rejectEarning", true)}
            onRefresh={() => mutateWalletTransaction()}
          />
        </div>
      )}

      {/* Dialogs */}
      <ApproveWithdrawDialog
        open={dialogs.approveWithdraw}
        onOpenChange={(open) => toggleDialog("approveWithdraw", open)}
        processing={processing}
        onConfirm={() =>
          handleApprove(
            () => approveWithdraw(walletTransaction.id),
            "approveWithdraw",
          )
        }
      />

      <RejectWithdrawDialog
        open={dialogs.rejectWithdraw}
        onOpenChange={(open) => toggleDialog("rejectWithdraw", open)}
        processing={processing}
        onReject={(reason) =>
          handleReject(rejectWithdraw, "rejectWithdraw", reason)
        }
      />

      <ApproveEarningDialog
        open={dialogs.approveEarning}
        onOpenChange={(open) => toggleDialog("approveEarning", open)}
        processing={processing}
        onConfirm={() =>
          handleApprove(
            () => approvePendingEarning(walletTransaction.id),
            "approveEarning",
          )
        }
      />

      {/* Uncomment and implement RejectEarningDialog when needed */}
      {/* <RejectEarningDialog
        open={dialogs.rejectEarning}
        onOpenChange={(open) => toggleDialog("rejectEarning", open)}
        processing={processing}
        onReject={(reason) => handleReject(rejectEarning, "rejectEarning", reason)}
      /> */}
    </div>
  );
}
