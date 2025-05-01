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
  BadgeCheck,
  Play,
  Upload,
  MessageCircleQuestion,
  Hourglass,
  Smile,
  RefreshCcw,
} from "lucide-react";
import { OrderStatus } from "../dto";

type BuyerOrderActionsProps = {
  status: OrderStatus;
  onViewDetails?: () => void;
  onAccept?: () => void;
  onRefresh?: () => void;
  onStart?: () => void;
  onCancel?: () => void;
  onDeliver?: () => void;
  onAskQuestion?: () => void;
  onReDeliver?: () => void;
};

export const OrderStatusButtonFreelancer = ({
  status,
  onViewDetails,
  onAccept,
  onRefresh,
  onStart,
  onCancel,
  onDeliver,
  onAskQuestion,
  onReDeliver,
}: BuyerOrderActionsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {/* <Button onClick={onViewDetails} variant="outline">
        <Eye className="h-4" /> View Details
      </Button> */}

      {status === OrderStatus.PENDING && (
        <>
          <Button onClick={onAccept} variant="outline">
            <Check className="h-4 text-green-500" /> Accept
          </Button>
          <Button onClick={onCancel} variant="outline">
            <Ban className="h-4 text-red-500" /> Cancel
          </Button>
        </>
      )}

      {status === OrderStatus.ACCEPTED && (
        <>
          <Button onClick={onStart} variant="outline">
            <Play className="h-4 text-green-500" /> Start Work
          </Button>
          <Button onClick={onCancel} variant="outline">
            <Ban className="h-4 text-red-500" /> Cancel
          </Button>
        </>
      )}

      {status === OrderStatus.IN_PROGRESS && (
        <>
          <Button onClick={onDeliver} variant="outline">
            <Upload className="h-4 text-green-500" /> Deliver Work
          </Button>
          <Button onClick={onAskQuestion} variant="outline">
            <MessageCircleQuestion className="h-4 text-orange-500" /> Ask Buyer
            a Question
          </Button>
          <Button onClick={onCancel} variant="outline">
            <Ban className="h-4 text-red-500" /> Cancel
          </Button>
        </>
      )}

      {status === OrderStatus.DELIVERED && (
        <>
          <Button className="pointer-events-none" variant="outline">
            <Hourglass className="h-4 text-green-500" /> Waiting for buyer to
            confirm...
          </Button>
        </>
      )}

      {status === OrderStatus.COMPLETED && (
        <>
          <Button className="pointer-events-none" variant="outline">
            <Smile className="h-4 text-green-500" /> Order completed.
          </Button>
        </>
      )}

      {status === OrderStatus.REVISION_REQUESTED && (
        <>
          <Button variant="outline" onClick={onReDeliver}>
            <Upload className="h-4 text-green-500" />
            Re-deliver Work
          </Button>

          <Button onClick={onAskQuestion} variant="outline">
            <MessageCircleQuestion className="h-4 text-orange-500" /> Ask Buyer
            a Question
          </Button>
        </>
      )}

      <Button variant="outline" onClick={onRefresh}>
        <RefreshCcw />
      </Button>
    </div>
  );
};
