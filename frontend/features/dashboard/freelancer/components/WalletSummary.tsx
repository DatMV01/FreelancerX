"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import {
  BadgeDollarSign,
  Banknote,
  Info,
  Loader2,
  RefreshCcw,
} from "lucide-react";
import { useState } from "react";
import WithdrawModal from "./WithdrawModal";

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
    <div className="space-y-6">
      <div className="flex items-center gap-x-2">
        <h2 className="text-2xl font-semibold">Summary</h2>
        <button className="inline-flex" onClick={() => mutate()}>
          <RefreshCcw />
        </button>
        <Button onClick={() => setOpenWithdrawCb(true)}>Widthdraw</Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="rounded-full bg-green-100 p-3 text-green-700">
              <BadgeDollarSign />
            </div>
            <div>
              <div className="text-muted-foreground flex items-center gap-1 text-sm">
                Pending Earrning
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 cursor-pointer text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Total of all pending orders.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="text-xl font-semibold text-green-600">
                ${wallet?.pendingEarrning}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="rounded-full bg-orange-100 p-3 text-orange-700">
              <BadgeDollarSign />
            </div>
            <div>
              <div className="text-muted-foreground flex items-center gap-1 text-sm">
                Pending Widthdraw
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 cursor-pointer text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Total of all pending widthdraw.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="text-xl font-semibold text-orange-600">
                ${wallet?.pendingWidthdraw}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
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
      </div>
    </div>
  );
}
