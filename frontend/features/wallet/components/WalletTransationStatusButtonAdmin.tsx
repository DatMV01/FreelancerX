import { Button } from "@/components/ui/button";
import {
  CreditCard,
  X,
  MessageSquare,
  RotateCcw,
  Check,
  FileDown,
  Info,
  Star,
  Eye,
  Ban,
  Hourglass,
  RefreshCcw,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { TransactionStatus, TransactionType } from "../wallet.type";

type Props = {
  status: TransactionStatus;
  type: TransactionType;
  onApproveWithdraw: () => void;
  onRejectWithdraw: () => void;
  onApproveEarning: () => void;
  onRejectEarning: () => void;
  onRefresh?: () => void;
};

export const WalletTransationStatusButtonAdmin = ({
  status,
  type,
  onApproveWithdraw,
  onRejectWithdraw,
  onApproveEarning,
  onRejectEarning,
  onRefresh,
}: Props) => {
  return (
    <div className="flex flex-wrap gap-x-2">
      {status == TransactionStatus.PENDING &&
        type == TransactionType.WITHDRAW && (
          <>
            <Button
              onClick={onApproveWithdraw}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4" />
              Approve Widthraw
            </Button>

            <Button onClick={onRejectWithdraw} variant="destructive">
              <XCircle className="h-4 w-4" />
              Reject Widthraw
            </Button>
          </>
        )}

      {status == TransactionStatus.PENDING &&
        type == TransactionType.EARNING && (
          <>
            <Button
              onClick={onApproveEarning}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4" />
              Approve Earning
            </Button>

            {/* <Button onClick={onRejectEarning} variant="destructive">
              <XCircle className="h-4 w-4" />
              Reject Earning
            </Button> */}
          </>
        )}

      <Button variant="outline" onClick={onRefresh}>
        <RefreshCcw />
      </Button>
    </div>
  );
};
