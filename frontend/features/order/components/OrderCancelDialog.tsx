import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

const OrderCancelDialog = ({
  open,
  processing = false,
  onOpenChange,
  handleCancelOrder,
}: {
  open: boolean;
  processing?: boolean;
  onOpenChange: (isOpen: boolean) => void;
  handleCancelOrder: () => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>Are you sure you want to cancel this order?</DialogHeader>
        <DialogFooter className="mt-4">
          <button
            className="flex items-center gap-2 rounded-sm border border-red-500 bg-white px-2 py-1 whitespace-nowrap text-red-500"
            onClick={handleCancelOrder}
          >
            {processing && <Loader2 className="animate-spin" size={18} />}
            <span> {processing ? "Processing..." : "Cancel"}</span>
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderCancelDialog;
