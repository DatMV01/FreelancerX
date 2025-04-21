import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";

const CancelOrderDialog = ({
  open,
  onOpenChange,
  handleCancelOrder,
}: {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  handleCancelOrder: () => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>Are you sure you want to cancel this order?</DialogHeader>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <button
            className="rounded-sm border border-red-500 bg-white px-2 py-1 whitespace-nowrap text-red-500"
            onClick={handleCancelOrder}
          >
            Confirm Cancel
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancelOrderDialog;
