import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  isLoading: boolean;
  mutate: () => void;
  setOpenWithdrawCb: any;
}

export default function WalletInfo({
  wallet,
  isLoading,
  mutate,
  setOpenWithdrawCb,
}: WalletCardProps) {
  if (isLoading) {
    return (
      <Card className="flex h-[200px] w-full max-w-xl items-center justify-center rounded-xl">
        <Loader2 className="animate-spin text-blue-500" size={24} />
      </Card>
    );
  }

  if (!wallet) return null;

  return (
    <Card className="w-full max-w-xl rounded-xl border-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet className="text-blue-600" />
          <CardTitle className="text-base font-semibold">My Wallet</CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={() => mutate()}>
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-blue-100 p-3 text-blue-700">
            <Banknote className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <div className="text-muted-foreground flex items-center gap-1 text-sm">
              Available Balance
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 cursor-pointer text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    This is the amount you can withdraw now.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              ${Number(wallet.availableBalance).toLocaleString()}
            </div>
          </div>
        </div>

        <Button
          onClick={setOpenWithdrawCb}
          className="w-full gap-2"
          disabled={wallet.availableBalance <= 0}
        >
          <ArrowDownCircle className="h-5 w-5" />
          Withdraw Funds
        </Button>
      </CardContent>
    </Card>
  );
}
