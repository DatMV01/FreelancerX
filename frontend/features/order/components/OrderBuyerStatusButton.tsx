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
} from "lucide-react";
import { OrderStatus } from "../dto";
type BuyerOrderActionsProps = {
  status: OrderStatus;
  onPay?: () => void;
  onCancel?: () => void;
  onComplete?: () => void;
  showRevisionButton: boolean;
  showRateButton: boolean;
  onRequestRevision?: () => void;
  onDownload?: () => void;
  onMessage?: () => void;
  onViewDetails?: () => void;
  onRate?: () => void;
};

export const OrderBuyerStatusButton = ({
  status,
  onPay,
  onCancel,
  onComplete,
  onRate,
  showRevisionButton,
  showRateButton,
  onRequestRevision,
  onDownload,
  onMessage,
  onViewDetails,
}: BuyerOrderActionsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {/* <Button onClick={onViewDetails} variant="outline">
        <Eye className="h-4" /> View Details
      </Button> */}

      {status === OrderStatus.UNPAID && (
        <>
          <Button onClick={onPay} variant="outline">
            <CreditCard className="h-4" />
            Pay
          </Button>
          <Button onClick={onCancel} variant="outline">
            <Ban className="h-4 text-red-500" /> Cancel
          </Button>
        </>
      )}

      {status === OrderStatus.PENDING && (
        <Button onClick={onCancel} variant="outline">
          <Ban className="h-4 text-red-500" /> Cancel
        </Button>
      )}

      {status === OrderStatus.DELIVERED && (
        <>
          <Button onClick={onComplete} variant="outline">
            <Check className="mr-2 h-4 w-4" />
            Complete
          </Button>
          {showRevisionButton && (
            <Button onClick={onRequestRevision} variant="outline">
              <RotateCcw className="mr-2 h-4 w-4" />
              Request Revision
            </Button>
          )}

          {/* <Button onClick={onCancel} variant="outline">
            <Ban className="h-4 text-red-500" /> Cancel
          </Button> */}
        </>
      )}

      {status === OrderStatus.REVISION_REQUESTED && (
        <>
          <Button className="pointer-events-none" variant="outline">
            <Hourglass className="h-4 text-green-500" /> Waiting for freelancer
            to re-delivered...
          </Button>
        </>
      )}

      {status === OrderStatus.COMPLETED && (
        <>
          {showRateButton && onRate && (
            <Button onClick={onRate} variant="outline">
              <Star className="mr-2 h-4 w-4" />
              Rate
            </Button>
          )}
        </>
      )}
    </div>
  );
};
