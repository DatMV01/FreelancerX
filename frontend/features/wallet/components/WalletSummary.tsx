"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import WithdrawModal from "@/features/dashboard/freelancer/components/WithdrawModal";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import {
  ArrowDownCircle,
  BadgeDollarSign,
  Banknote,
  Info,
  Loader2,
  RefreshCcw,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { requestWithdraw } from "../wallet.api";
import { toast } from "sonner";
import { CardHeader } from "@mui/material";

export function WalletSummary({
  wallet,
  mutate,
  isLoading,
  setOpenWithdrawCb,
}: {
  wallet: any;
  mutate: any;
  setOpenWithdrawCb: any;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="h-full w-full">
        <Loader2 className="m-auto animate-spin" size={18} />
      </div>
    );
  }

  if (!wallet) {
    return;
  }

  return (
    <Card className="w-full max-w-xl rounded-2xl shadow-md">
      {/* <CardHeader className="flex items-center justify-between gap-2">
        <div className="inline-flex gap-x-2">
          <Wallet className="text-primary h-6 w-6" />
          <CardTitle className="text-xl font-semibold">
            Wallet Information
          </CardTitle>
        </div>

        <div className="flex items-center gap-x-2">
          <h2 className="text-2xl font-semibold">Summary</h2>
          <button className="inline-flex" onClick={() => mutate()}>
            <RefreshCcw />
          </button>
        </div>

        <Button
          onClick={setOpenWithdrawCb}
          className="inline-flex gap-2"
          disabled={wallet.availableBalance <= 0}
        >
          <ArrowDownCircle className="h-4 w-4" />
          Withdraw
        </Button>

      </CardHeader> */}
      <CardHeader className="flex items-center justify-between gap-2">
        <div className="inline-flex items-center gap-x-2">
          <Wallet />
          <CardTitle className="text-xl font-semibold">
            Wallet Information
          </CardTitle>
          <button className="inline-flex" onClick={() => mutate()}>
            <RefreshCcw />
          </button>
        </div>
        <Button
          onClick={setOpenWithdrawCb}
          className="inline-flex gap-2"
          disabled={wallet.availableBalance <= 0}
        >
          <ArrowDownCircle className="h-4 w-4" />
          Withdraw
        </Button>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-blue-100 p-3 text-blue-700">
            <Banknote />
          </div>

          <div>
            <div className="text-muted-foreground flex items-center gap-1 text-sm">
              Available Balance
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 cursor-pointer text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Available Balance</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="text-xl font-semibold text-blue-600">
              ${wallet?.availableBalance}
            </div>
          </div>
        </div>
      </CardContent>

 
    </Card>
  );
}
