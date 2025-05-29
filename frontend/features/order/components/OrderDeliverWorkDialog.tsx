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
import { Loader2, Paperclip } from "lucide-react";
import { FileUploader } from "@/features/files/components/FileUploader";
import { CharCountTextareaBasic } from "@/components/CharCountTextareaBasic";

const OrderDeliverWorkDialog = React.memo(
  ({
    open,
    onOpenChange,
    onSubmit,
    processing = false,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (payload: { message: string; file?: File }) => void;
    processing?: boolean;
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
        <DialogContent className="w-full">
          <DialogHeader>
            <DialogTitle>Deliver Work</DialogTitle>
          </DialogHeader>

          <div className="w-full space-y-4 overflow-x-hidden">
            {/* <Textarea
              placeholder="Add a message to the buyer..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            /> */}
            {/* <Input type="file" accept=".zip" onChange={handleFileChange} /> */}

            <CharCountTextareaBasic
              placeholder="Add a message to the buyer..."
              value={message}
              className="h-45"
              onChange={(val) => setMessage(val)}
            />
            <label className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1 text-sm">
              <Paperclip className="h-4 w-4" />
              Attach your .zip file (optional)
            </label>
            <FileUploader
              accept={["zip"]}
              className="h-45 w-full"
              onChange={(file) => {
                // setError("");
                setFile(file);
              }}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <DialogFooter className="mt-4">
            <Button
              className="flex items-center justify-center gap-2"
              onClick={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              disabled={processing || !message.trim() || !!error}
            >
              {processing && <Loader2 className="animate-spin" size={18} />}
              <span> {processing ? "Processing..." : "Deliver Work"}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
);

export default OrderDeliverWorkDialog;
