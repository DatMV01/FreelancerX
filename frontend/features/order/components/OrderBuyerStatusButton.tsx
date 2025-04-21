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
} from "lucide-react";
import { OrderStatus } from "../dto";
type BuyerOrderActionsProps = {
  status: OrderStatus;
  onPay?: () => void;
  onCancel?: () => void;
  onAccept?: () => void;
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
  onAccept,
  onRequestRevision,
  onDownload,
  onMessage,
  onViewDetails,
  onRate,
}: BuyerOrderActionsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={onViewDetails} variant="outline">
        <Eye className="h-4" /> View Details
      </Button>

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
{/* 
      {status === OrderStatus.REVISION_REQUESTED && (
        <Button disabled variant="secondary">
          <Info className="h-4" /> Revision Waiting
        </Button>
      )} */}

      {status === OrderStatus.DELIVERED && (
        <>
          <Button onClick={onAccept} variant="outline">
            <Check className="mr-2 h-4 w-4" />
            Accept
          </Button>
          <Button onClick={onRequestRevision} variant="outline">
            <RotateCcw className="mr-2 h-4 w-4" />
            Request Revision
          </Button>
          {/* <Button onClick={onDownload} variant="ghost">
            <FileDown className="mr-2 h-4 w-4" />
            Tải sản phẩm
          </Button> */}
        </>
      )}

      {status === OrderStatus.COMPLETED && (
        <>
          {onRate && (
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
