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
} from "lucide-react";
import { OrderStatus } from "../dto";
type Props = {
  status: OrderStatus;
  onPay?: () => void;
  onCancel?: () => void;
  onComplete?: () => void;
  showRevisionButton: boolean;
  showRateButton: boolean;
  onRequestRevision?: () => void;
  onRefresh?: () => void;
  onMessage?: () => void;
  onViewDetails?: () => void;
  onRate?: () => void;
};

export const OrderStatusButtonAdmin = ({
  status,
  onPay,
  onCancel,
  onComplete,
  onRate,
  showRevisionButton,
  showRateButton,
  onRequestRevision,
  onRefresh,
  onMessage,
  onViewDetails,
}: Props) => {
  return (
    <div className="flex flex-wrap gap-x-2">
      {/* <Button onClick={onViewDetails} variant="outline">
        <Eye className="h-4" /> View Details
      </Button> */}

      {status !== OrderStatus.COMPLETED &&
        status !== OrderStatus.REFUND &&
        status !== OrderStatus.CANCEL && (
          <Button onClick={onCancel} variant="outline">
            <Ban className="h-4 text-red-500" /> Cancel
          </Button>
        )}

      <Button variant="outline" onClick={onRefresh}>
        <RefreshCcw />
      </Button>
    </div>
  );
};
