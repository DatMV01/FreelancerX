import { CharCountTextareaBasic } from "@/components/CharCountTextareaBasic";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
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

        <CharCountTextareaBasic
          placeholder="Enter your question..."
          maxLength={500}
          className="h-70 w-full break-all"
          value={question}
          onChange={(val) => setQuestion(val)}
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
