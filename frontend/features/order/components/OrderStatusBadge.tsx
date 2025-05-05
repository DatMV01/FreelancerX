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

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  let color = "";
  let icon: React.ReactNode = null;
  let label = status;

  switch (status) {
    case OrderStatus.UNPAID:
      color = "bg-orange-100 text-orange-800";
      icon = <CreditCard className="text-orange-500" />;
      break;
    case OrderStatus.PENDING:
      color = "bg-yellow-100 text-yellow-800";
      icon = <Clock className="text-yellow-500" />;
      break;
    case OrderStatus.ACCEPTED:
      color = "bg-cyan-100 text-cyan-800";
      icon = <CheckCircle className="text-cyan-500" />;
      break;
    case OrderStatus.PROGRESS:
      color = "bg-blue-100 text-blue-800";
      icon = <Hammer className="text-blue-500" />;
      break;
    case OrderStatus.REVISION:
      color = "bg-purple-100 text-purple-800";
      icon = <RefreshCw className="text-purple-500" />;
      break;
    case OrderStatus.DELIVERED:
      color = "bg-indigo-100 text-indigo-800";
      icon = <Package className="text-indigo-500" />;
      break;
    case OrderStatus.COMPLETED:
      color = "bg-emerald-100 text-emerald-800";
      icon = <BadgeCheck className="text-emerald-500" />;
      break;
    case OrderStatus.CANCEL:
      color = "bg-red-100 text-red-800";
      icon = <Ban className="text-red-500" />;
      break;
    case OrderStatus.REFUND:
      color = "bg-sky-100 text-sky-800";
      icon = <RotateCcw className="text-sky-500" />;
      break;
    default:
      color = "bg-gray-100 text-gray-800";
      icon = null;
      break;
  }

  return (
    <Badge className={`inline-flex items-center gap-1 ${color}`}>
      {icon}
      {label}
    </Badge>
  );
}
