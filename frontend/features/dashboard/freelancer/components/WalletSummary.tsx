"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { BadgeDollarSign, Banknote, Info } from "lucide-react";
import { useState } from "react";

export function WalletSummary({
  setOpenWithdrawCb,
}: {
  setOpenWithdrawCb: any;
}) {
  // Fake data

  const [summary, setSummary] = useState({
    availableBalance: 400.25,
    pendingBalance: 120.5,
  });

  return (
    <>
      <h2 className="text-2xl font-semibold">Summary</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-green-100 p-3 text-green-700">
              <BadgeDollarSign />
            </div>
            <div>
              <div className="text-muted-foreground flex items-center gap-1 text-sm">
                Pending Balance
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 cursor-pointer text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>
                        Total of all entries from orders, including undrawn and
                        pending orders.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="text-xl font-semibold text-green-600">
                ${summary.pendingBalance.toFixed(2)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
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
                  ${summary.availableBalance.toFixed(2)}
                </div>
              </div>

              <Button onClick={() => setOpenWithdrawCb(true)}>Withdraw</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
