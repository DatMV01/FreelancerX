import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const AskQuestionDialog = ({
  open,
  onOpenChange,
  handleAskQuestion,
}: {
  open: boolean;
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
            className="rounded-sm border border-orange-500 bg-white px-2 py-1 whitespace-nowrap text-orange-500"
            onClick={() => handleAskQuestion(question)}
          >
            Ask
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AskQuestionDialog;
