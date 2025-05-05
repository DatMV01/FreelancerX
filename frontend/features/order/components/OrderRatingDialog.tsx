"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Rating } from "@mui/material";
import { toast } from "sonner";

type Props = {
  open: boolean;
  processing?: boolean;
  onOpenChange: (isOpen: boolean) => void;
  orderNo: string;
  handleSubmit: (data: { rating: number; review: string }) => void;
};

export function OrderRatingDialog({
  open,
  processing = false,
  onOpenChange,
  orderNo,
  handleSubmit,
}: Props) {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState("");

  const onSubmit = () => {
    if (rating > 0) {
      handleSubmit({ rating, review });
      onOpenChange(false);
      setRating(0);
      setReview("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-green-900">{orderNo}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Rating
            name="half-rating"
            defaultValue={0}
            precision={1}
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue ?? 0);
            }}
          />

          <Textarea
            placeholder="Your comment..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
        </div>

        <DialogFooter className="pt-4">
          <Button
            className="flex items-center gap-2"
            onClick={onSubmit}
            disabled={rating === 0 || processing}
          >
            {processing && <Loader2 className="animate-spin" size={18} />}
            <span> {processing ? "Processing..." : "Send"}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
