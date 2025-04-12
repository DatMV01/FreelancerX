"use client";

import { Button } from "@/components/ui/button";
 
import { useSWRConfig } from "swr";
import { toast } from "sonner";
import { useState } from "react";
import { OrderStatus } from "../dto";

export function StartOrderButton({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [loading, setLoading] = useState(false);
  const { mutate } = useSWRConfig();

  const handleStart = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "in_progress" }),
      });

      if (!res.ok) throw new Error("Lỗi cập nhật đơn");

      toast.success("Đã bắt đầu đơn hàng");
      mutate(`/api/orders/${orderId}`); // cập nhật cache chi tiết đơn
      mutate("/api/orders"); // cập nhật danh sách đơn
    } catch (err) {
      toast.error("Không thể cập nhật đơn hàng");

      //  toast("Đơn hàng đang được xử lý...", {
      //    description: "Vui lòng chờ trong giây lát.",
      //    action: {
      //      label: "Đóng",
      //      onClick: () => console.log("Đã đóng"),
      //    },
      //  });

      
    } finally {
      setLoading(false);
    }
  };

  if (currentStatus !== OrderStatus.PAID) return null;

  return (
    <Button onClick={handleStart} disabled={loading}>
      {loading ? "Đang cập nhật..." : "Bắt đầu làm việc"}
    </Button>
  );
}
