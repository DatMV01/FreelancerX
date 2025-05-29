import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const RejectWithdrawDialog = ({
  open,
  processing,
  onOpenChange,
  onReject,
}: {
  open: boolean;
  processing?: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onReject: (reason: string) => void;
}) => {
  const [reason, setReason] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>Reject Withdraw Request</DialogHeader>
        <Textarea
          placeholder="Enter rejection reason..."
          className="h-40"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            disabled={processing}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="ghost"
            className="flex items-center gap-2 rounded-sm border border-red-500 bg-white px-2 py-1 whitespace-nowrap text-red-500"
            onClick={() => onReject(reason)}
            disabled={processing}
          >
            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {processing ? "Processing..." : "Reject"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectWithdrawDialog;
