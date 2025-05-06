import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

const ApproveEarningDialog = ({
  open,
  processing,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  processing?: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: () => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>Approve Earning Record</DialogHeader>
        <p>Are you sure you want to approve this earning?</p>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="ghost"
            className="flex items-center gap-2 rounded-sm border border-green-500 bg-white px-2 py-1 whitespace-nowrap text-green-500"
            onClick={onConfirm}
            disabled={processing}
          >
            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {processing ? "Processing..." : "Approve"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApproveEarningDialog;
