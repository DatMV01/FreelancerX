import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

const OrderAcceptDialog = ({
  open,
  processing = false,
  onOpenChange,
  handleAcceptOrder,
}: {
  open: boolean;
  processing?: boolean;
  onOpenChange: (isOpen: boolean) => void;
  handleAcceptOrder: () => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>Are you sure you want to accept this order?</DialogHeader>
        <DialogFooter className="mt-4">
          <button
            className="flex items-center gap-2 rounded-sm border border-green-500 bg-white px-2 py-1 whitespace-nowrap text-green-500"
            onClick={handleAcceptOrder}
          >
            {processing && <Loader2 className="animate-spin" size={18} />}
            <span> {processing ? "Processing..." : "Accept"}</span>
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderAcceptDialog;
