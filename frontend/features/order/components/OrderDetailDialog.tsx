import React from "react";
import useSWR from "swr";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CircularProgress } from "@mui/material";
import { Badge } from "@/components/ui/badge";
import { OrderStatusTimeline } from "./OrderStatusTimeline";
import { statusMap } from "@/pages/order/manage";
import { getOrderById } from "../order.api";
import { OrderDetailBuyer } from "./OrderDetailBuyer";
import { VisuallyHidden } from "radix-ui";

type OrderDetailModalProps = {
  orderId: string | null | undefined;
  open: boolean;
  onClose: () => void;
};

export const OrderDetailDialog: React.FC<OrderDetailModalProps> = ({
  orderId,
  open,
  onClose,
}) => {
  if (!orderId) return null;

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    `/orders/${orderId}`,
    () => getOrderById(orderId),
  );
  console.log("data", data);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="flex h-[95vh] max-w-md flex-col justify-between md:max-w-6xl">
        <VisuallyHidden.Root>
          <DialogHeader> </DialogHeader>
        </VisuallyHidden.Root>
        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <CircularProgress size={24} />
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center py-4 text-red-500">
            <p>Order is not found.</p>
          </div>
        )}

        {data && <OrderDetailBuyer  order={data} />}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
