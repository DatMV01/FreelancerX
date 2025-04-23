import React, { useState } from "react";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface ReviewProps {
  review: {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    reply: string | null;
    repliedAt: string | null;
  };
  isFreelancer?: boolean; // truyền vào từ ngoài
  onReplySubmit?: (reviewId: string, replyText: string) => void;
}

export default function OrderReview({
  review,
  isFreelancer = false,
  onReplySubmit,
}: ReviewProps) {
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const MAX_LENGTH = 500;
  const isTooLong = replyText.length > MAX_LENGTH;

  const formattedDate = new Date(review.createdAt).toLocaleDateString();

  const handleSubmit = async () => {
    if (!replyText.trim()) return;
    setIsSubmitting(true);
    try {
      onReplySubmit?.(review.id, replyText);
      setReplyText("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className=" ">
      <CardContent className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                fill={i < review.rating ? "currentColor" : "none"}
              />
            ))}
          </div>
          <span className="text-muted-foreground text-sm">{formattedDate}</span>
        </div>

        <p className="text-foreground text-sm">{review.comment}</p>

        {review.reply ? (
          <div className="bg-muted/50 mt-2 rounded-xl p-3">
            <p className="text-muted-foreground text-xs font-semibold">
              Response:
            </p>
            <p className="text-sm">{review.reply}</p>
            {review.repliedAt && (
              <p className="text-muted-foreground mt-1 text-xs">
                {new Date(review.repliedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        ) : isFreelancer ? (
          <div className="mt-3 space-y-2">
            <Textarea
              placeholder="Type response..."
              value={replyText}
              onChange={(e) => {
                const value = e.target.value;
                setReplyText(value.slice(0, MAX_LENGTH)); // tự động cắt luôn khi gõ
              }}
              className="min-h-[80px] !ring-0"
            />
            <div className="text-muted-foreground flex items-center justify-between text-xs">
              <span>
                {replyText.length}/{MAX_LENGTH} characters
              </span>
              {isTooLong && (
                <span className="text-red-500">
                  Exceeded 500 character limit
                </span>
              )}
            </div>

            <Button
              onClick={handleSubmit}
              variant="outline"
              disabled={isSubmitting || !replyText.trim() || isTooLong}
            >
              {isSubmitting ? "Sending..." : "Send response"}
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
