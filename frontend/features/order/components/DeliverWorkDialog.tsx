import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const DeliverWorkDialog = React.memo(
  ({
    open,
    onOpenChange,
    onSubmit,
    loading,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (payload: { message: string; file?: File }) => void;
    loading?: boolean;
  }) => {
    const [message, setMessage] = useState("");
    const [file, setFile] = useState<File | undefined>();
    const [error, setError] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const selected = e.target.files?.[0];
      if (!selected) return;

      const isZip = selected.name.endsWith(".zip");
      const isUnder30MB = selected.size <= 30 * 1024 * 1024;

      if (!isZip) {
        setError("Only .zip files are allowed.");
        setFile(undefined);
      } else if (!isUnder30MB) {
        setError("File must be smaller than 30MB.");
        setFile(undefined);
      } else {
        setError("");
        setFile(selected);
      }
    };

    const handleSubmit = () => {
      if (!message.trim()) return;
      onSubmit({ message, file });
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deliver Work</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Textarea
              placeholder="Add a message to the buyer..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Input type="file" accept=".zip" onChange={handleFileChange} />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              disabled={loading || !message.trim() || !!error}
            >
              {loading ? "Delivering..." : "Deliver Work"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
);

export default DeliverWorkDialog;
