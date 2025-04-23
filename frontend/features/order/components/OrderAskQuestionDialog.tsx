import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const OrderAskQuestionDialog = ({
  open,
  processing,
  onOpenChange,
  handleAskQuestion,
}: {
  open: boolean;
  processing?: boolean;
  onOpenChange: (isOpen: boolean) => void;
  handleAskQuestion: (question: string) => void;
}) => {
  const [question, setQuestion] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>Ask buyer a Question</DialogHeader>

        <Textarea
          placeholder="Enter your question..."
          className="h-60"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <button
            className="flex items-center gap-2 rounded-sm border border-orange-500 bg-white px-2 py-1 text-orange-500"
            onClick={() => handleAskQuestion(question)}
          >
            {processing && <Loader2 className="animate-spin" size={18} />}
            <span> {processing ? "Processing..." : "Ask"}</span>
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderAskQuestionDialog;
