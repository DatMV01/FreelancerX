// components/WalletCard.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowDownCircle,
  Banknote,
  Info,
  Loader2,
  RefreshCcw,
  Wallet,
} from "lucide-react";
import { WalletEntity } from "../wallet.type";
interface WalletCardProps {
  wallet: WalletEntity;
  isLoading: any;
  mutate: any;
  setOpenWithdrawCb: any;
}

export default function WalletInfo({
  wallet,
  mutate,
  isLoading,
  setOpenWithdrawCb,
}: WalletCardProps) {
  if (!wallet) {
    return;
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-xl rounded-2xl shadow-md">
        <Loader2 className="m-auto animate-spin" size={18} />
      </Card>
    );
  }

  return (
    <Card className="w-full rounded-2xl shadow-md">
      <CardHeader className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-x-2">
          <Wallet />
          <div className="text-xl font-semibold">Wallet</div>
          <button className="inline-flex" onClick={() => mutate()}>
            <RefreshCcw size={18} />
          </button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-blue-100 p-3 text-blue-700">
            <Banknote />
          </div>

          <div className="flex flex-col">
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
        <Button
          onClick={setOpenWithdrawCb}
          className="gap-2"
          disabled={wallet.availableBalance <= 0}
        >
          <ArrowDownCircle />
          Withdraw
        </Button>
      </CardContent>

      {/* <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground flex items-center gap-2">
            <Hash className="h-4 w-4" />
            <span>Wallet ID:</span>
          </div>
          <span className="text-right font-mono text-sm break-all">
            {wallet.id}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-muted-foreground flex items-center gap-2">
            <User2 className="h-4 w-4" />
            <span>User ID:</span>
          </div>
          <span className="text-right font-mono text-sm">{wallet.userId}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-muted-foreground flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span>Balance:</span>
          </div>
          <span className="font-semibold text-green-600">
            {Number(wallet.availableBalance).toLocaleString()} {wallet.currency}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-muted-foreground flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span>Currency:</span>
          </div>
          <Badge variant="outline">{wallet.currency}</Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-muted-foreground flex items-center gap-2">
            <CalendarClock className="h-4 w-4" />
            <span>Created At:</span>
          </div>
          <span className="text-sm">
            {format(new Date(wallet.createdAt), "PPPp")}
          </span>
        </div>
      </CardContent> */}
    </Card>
  );
}
