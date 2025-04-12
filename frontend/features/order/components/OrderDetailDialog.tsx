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

type OrderDetailModalProps = {
  orderId: string | null;
  open: boolean;
  onClose: () => void;
};

export const fetchOrderById = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        client: `Nguyễn Văn ${id}`,
        package: "Professional Logo Design",
        status: "IN_PROGRESS",
        deadline: "2025-04-30",
        description: "Thiết kế logo cao cấp với concept độc đáo.",
        attachments: [],
        tags: ["Thiết kế", "Logo"],
      });
    }, 1000);
  });
};

export const OrderDetailDialog: React.FC<OrderDetailModalProps> = ({
  orderId,
  open,
  onClose,
}) => {
  const {
    data: selectedOrder,
    isLoading,
    error,
  } = useSWR(orderId ? `/api/orders/${orderId}` : null, (_, id) =>
    fetchOrderById(id),
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>Chi tiết đơn hàng</DialogHeader>

        {isLoading ? (
          <CircularProgress />
        ) : error ? (
          <p className="text-red-500">Lỗi khi tải dữ liệu</p>
        ) : selectedOrder ? (
          <div className="space-y-2 text-sm">
            <p>
              <strong>Khách hàng:</strong> {selectedOrder.client}
            </p>
            <p>
              <strong>Dịch vụ:</strong> {selectedOrder.package}
            </p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              {statusMap[selectedOrder.status]?.label || selectedOrder.status}
            </p>
            <p>
              <strong>Deadline:</strong> {selectedOrder.deadline}
            </p>
            <p>
              <strong>Mô tả:</strong> {selectedOrder.description}
            </p>
            <div>
              <strong>Tags:</strong>{" "}
              {selectedOrder.tags?.map((tag: string, i: number) => (
                <Badge key={i} className="mr-1">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Lịch sử trạng thái (có thể lấy từ backend sau) */}
            <OrderStatusTimeline
              history={
                selectedOrder.statusHistory || [
                  { status: "created", time: "2025-04-10 09:00" },
                  { status: "accepted", time: "2025-04-10 10:00" },
                  { status: "in_progress", time: "2025-04-10 13:00" },
                  { status: "completed", time: "2025-04-11 17:30" },
                ]
              }
            />
          </div>
        ) : (
          <p>Không có dữ liệu</p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
