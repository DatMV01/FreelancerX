import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle,
  Hourglass,
  Loader,
  XCircle,
  SendHorizonal,
  Pencil,
} from "lucide-react";
import { JSX } from "react";

export enum OrderStatus {
  UNPAID = "UNPAID", // 🟥 Đơn hàng chưa được thanh toán
  PENDING = "PENDING", // 🟡 Đơn hàng đã được tạo, đang chờ freelancer chấp nhận
  ACCEPTED = "ACCEPTED", // 🟢 Freelancer đã chấp nhận đơn, chuẩn bị bắt đầu
  IN_PROGRESS = "IN_PROGRESS", // 🔨 Freelancer đang thực hiện đơn hàng
  REVISION_REQUESTED = "REVISION_REQUESTED", // 🔄 Buyer yêu cầu chỉnh sửa/giao lại
  DELIVERED = "DELIVERED", // 📦 Freelancer đã gửi sản phẩm (chờ buyer phản hồi)
  COMPLETED = "COMPLETED", // ✅ Đơn hàng đã hoàn tất (buyer xác nhận hoặc tự động sau thời gian)

  // PENDING = 'PENDING',
  // PAID = 'PAID',
  // IN_PROGRESS = 'IN_PROGRESS',
  // DELIVERED = 'DELIVERED',
  // COMPLETED = 'COMPLETED',
  // CANCELED = 'CANCELED',
  // REFUNDED = 'REFUNDED',
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const statusMap: Record<
    OrderStatus,
    { label: string; color: string; icon: JSX.Element }
  > = {
    UNPAID: {
      label: "Chưa thanh toán",
      color: "bg-red-100 text-red-700",
      icon: <XCircle className="mr-1 h-4 w-4" />,
    },
    PENDING: {
      label: "Chờ xác nhận",
      color: "bg-yellow-100 text-yellow-800",
      icon: <Hourglass className="mr-1 h-4 w-4" />,
    },
    ACCEPTED: {
      label: "Đã chấp nhận",
      color: "bg-blue-100 text-blue-800",
      icon: <CheckCircle className="mr-1 h-4 w-4" />,
    },
    IN_PROGRESS: {
      label: "Đang thực hiện",
      color: "bg-indigo-100 text-indigo-800",
      icon: <Loader className="mr-1 h-4 w-4 animate-spin" />,
    },
    REVISION_REQUESTED: {
      label: "Yêu cầu chỉnh sửa",
      color: "bg-orange-100 text-orange-800",
      icon: <Pencil className="mr-1 h-4 w-4" />,
    },
    DELIVERED: {
      label: "Đã giao hàng",
      color: "bg-teal-100 text-teal-800",
      icon: <SendHorizonal className="mr-1 h-4 w-4" />,
    },
    COMPLETED: {
      label: "Đã hoàn tất",
      color: "bg-green-100 text-green-800",
      icon: <CheckCircle className="mr-1 h-4 w-4" />,
    },
  };

  const current = statusMap[status];

  return (
    <Badge className={`inline-flex items-center ${current.color}`}>
      {current.icon}
      {current.label}
    </Badge>
  );
}
