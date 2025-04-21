import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";

const AcceptlOrderDialog = ({
  open,
  onOpenChange,
  handleAcceptOrder,
}: {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  handleAcceptOrder: () => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>Are you sure you want to accept this order?</DialogHeader>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <button
            className="rounded-sm border border-green-500 bg-white px-2 py-1 whitespace-nowrap text-green-500"
            onClick={handleAcceptOrder}
          >
            Accept Order
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AcceptlOrderDialog;
