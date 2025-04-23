import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { CircularProgress } from "@mui/material";
import { VisuallyHidden } from "radix-ui";
import React from "react";
import useSWR from "swr";
import { getOrderById } from "../order.api";
import { OrderDetailBuyer } from "./OrderDetailBuyer";

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
