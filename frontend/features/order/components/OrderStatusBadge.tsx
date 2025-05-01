import { Badge } from "@/components/ui/badge";
import {
  BadgeCheck,
  Ban,
  CheckCircle,
  Clock,
  CreditCard,
  Hammer,
  Package,
  RefreshCw,
  RotateCcw,
} from "lucide-react";
import { OrderStatus } from "../dto";

export const statusMap = {
  UNPAID: {
    label: "Unpaid",
    color: "bg-orange-100 text-orange-800",
    icon: <CreditCard className="text-orange-500" />,
  },
  PENDING: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
    icon: <Clock className="text-yellow-500" />,
  },
  ACCEPTED: {
    label: "Accepted",
    color: "bg-cyan-100 text-cyan-800",
    icon: <CheckCircle className="text-cyan-500" />,
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "bg-blue-100 text-blue-800",
    icon: <Hammer className="text-blue-500" />,
  },
  REVISION_REQUESTED: {
    label: "Revision Requested",
    color: "bg-purple-100 text-purple-800",
    icon: <RefreshCw className="text-purple-500" />,
  },
  DELIVERED: {
    label: "Delivered",
    color: "bg-indigo-100 text-indigo-800",
    icon: <Package className="text-indigo-500" />,
  },
  COMPLETED: {
    label: "Completed",
    color: "bg-emerald-100 text-emerald-800",
    icon: <BadgeCheck className="text-emerald-500" />,
  },
  CANCEL: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800",
    icon: <Ban className="text-red-500" />,
  },
  REFUND: {
    label: "Refunded",
    color: "bg-sky-100 text-sky-800",
    icon: <RotateCcw className="text-sky-500" />,
  },
};

export const statusMap2 = {
  UNPAID: {
    label: "Unpaid",
    color: "bg-orange-100 text-orange-800",
    icon: <CreditCard className="text-orange-500" />,
  },
  PENDING: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
    icon: <Clock className="text-yellow-500" />,
  },
  ACCEPTED: {
    label: "Accepted",
    color: "bg-orange-100 text-orange-800",
    icon: <CheckCircle className="text-orange-500" />,
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "bg-blue-100 text-blue-800",
    icon: <Hammer className="text-blue-500" />,
  },
  REVISION_REQUESTED: {
    label: "Revision Requested",
    color: "bg-purple-100 text-purple-800",
    icon: <RefreshCw className="text-purple-500" />,
  },
  DELIVERED: {
    label: "Delivered",
    color: "bg-indigo-100 text-indigo-800",
    icon: <Package className="text-indigo-500" />,
  },
  COMPLETED: {
    label: "Completed",
    color: "bg-emerald-100 text-emerald-800",
    icon: <BadgeCheck className="text-emerald-500" />,
  },
  CANCEL: {
    label: "Cancel",
    color: "bg-red-100 text-red-800",
    icon: <Ban className="text-red-500" />,
  },
  REFUND: {
    label: "Refund",
    color: "bg-yellow-100 text-yellow-800",
    icon: <RotateCcw className="text-yellow-500" />,
  },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const current = statusMap[status];

  return (
    <Badge className={`inline-flex items-center ${current.color}`}>
      {current.icon}
      {current.label}
    </Badge>
  );
}
