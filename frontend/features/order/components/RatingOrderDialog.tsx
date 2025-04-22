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
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  orderId: string;
  handleSubmit: (data: { rating: number; review: string }) => void;
};

export function RatingOrderDialog({
  open,
  onOpenChange,
  orderId,
  handleSubmit,
}: Props) {
  const [rating, setRating] = useState(0);
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
          <DialogTitle>Order #{orderId}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={24}
                className={cn(
                  "cursor-pointer transition",
                  star <= rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300",
                )}
                onClick={() => setRating(star)}
              />
            ))}
          </div>

          <Textarea
            placeholder="Your comment..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
        </div>

        <DialogFooter className="pt-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={rating === 0}>
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
