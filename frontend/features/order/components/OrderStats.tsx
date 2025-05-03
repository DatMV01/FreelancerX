"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  BadgeCheck,
  CheckCircle,
  Clock,
  CreditCard,
  FileText,
  Hammer,
  RotateCcw,
  Send,
  XCircle,
  DollarSign,
  RefreshCw,
  Ban,
  RefreshCcw,
  Package,
} from "lucide-react";
import { OrderStatus } from "../dto";

export default function OrderStats({
  orders,
  requiredStatus,
}: {
  orders: any;
  requiredStatus?: string[];
}) {
  if (!orders) {
    return <p className="text-muted-foreground text-sm">Loading...</p>;
  }

  const totalRevenue = orders
    .filter((o: any) => o.status === OrderStatus.COMPLETED)
    .reduce((sum: number, o: any) => sum + Number(o.totalAmount), 0);

  const stats = [
    {
      key: OrderStatus.UNPAID,
      title: "UNPAID",
      value: orders.filter((o: any) => o.status === OrderStatus.UNPAID).length,
      icon: CreditCard,
      color: "text-orange-600",
    },
    {
      key: OrderStatus.PENDING,
      title: "PENDING",
      value: orders.filter((o: any) => o.status === OrderStatus.PENDING).length,
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      key: OrderStatus.ACCEPTED,
      title: "ACCEPTED",
      value: orders.filter((o: any) => o.status === OrderStatus.ACCEPTED)
        .length,
      icon: CheckCircle,
      color: "text-cyan-600",
    },
    {
      key: OrderStatus.IN_PROGRESS,
      title: "IN PROGRESS",
      value: orders.filter((o: any) => o.status === OrderStatus.IN_PROGRESS)
        .length,
      icon: Hammer,
      color: "text-blue-600",
    },
    {
      key: OrderStatus.REVISION_REQUESTED,
      title: "REVISION",
      value: orders.filter(
        (o: any) => o.status === OrderStatus.REVISION_REQUESTED,
      ).length,
      icon: RefreshCw,
      color: "text-purple-600",
    },
    {
      key: OrderStatus.DELIVERED,
      title: "DELIVERED",
      value: orders.filter((o: any) => o.status === OrderStatus.DELIVERED)
        .length,
      icon: Package,
      color: "text-indigo-600",
    },
    {
      key: OrderStatus.COMPLETED,
      title: "COMPLETED",
      value: orders.filter((o: any) => o.status === OrderStatus.COMPLETED)
        .length,
      icon: BadgeCheck,
      color: "text-emerald-600",
    },
    {
      key: OrderStatus.CANCEL,
      title: "CANCELLED",
      value: orders.filter((o: any) => o.status === OrderStatus.CANCEL).length,
      icon: Ban,
      color: "text-red-600",
    },
    {
      key: OrderStatus.REFUND,
      title: "REFUNDED",
      value: orders.filter((o: any) => o.status === OrderStatus.REFUND).length,
      icon: RotateCcw,
      color: "text-sky-600",
    },
    {
      key: "TOTAL_ORDERS",
      title: "TOTAL ORDERS",
      value: orders.length,
      icon: FileText,
      color: "text-blue-600",
    },
    {
      key: "TOTAL_REVENUE",
      title: "TOTAL REVENUE",
      value: `${totalRevenue.toLocaleString()} USD`,
      icon: DollarSign,
      color: "text-emerald-600",
    },
  ];

  const stats2 = [
    {
      key: OrderStatus.UNPAID,
      title: "UNPAID",
      value: orders.filter((o: any) => o.status === OrderStatus.UNPAID).length,
      icon: CreditCard,
      color: "text-orange-600",
    },
    {
      key: OrderStatus.PENDING,
      title: "PENDING",
      value: orders.filter((o: any) => o.status === OrderStatus.PENDING).length,
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      key: OrderStatus.ACCEPTED,
      title: "ACCEPTED",
      value: orders.filter((o: any) => o.status === OrderStatus.ACCEPTED)
        .length,
      icon: CheckCircle,
      color: "text-orange-500",
    },
    {
      key: OrderStatus.IN_PROGRESS,
      title: "IN PROGRESS",
      value: orders.filter((o: any) => o.status === OrderStatus.IN_PROGRESS)
        .length,
      icon: Hammer,
      color: "text-orange-500",
    },
    {
      key: OrderStatus.REVISION_REQUESTED,
      title: "REVISION",
      value: orders.filter(
        (o: any) => o.status === OrderStatus.REVISION_REQUESTED,
      ).length,
      icon: RefreshCw,
      color: "text-orange-500",
    },
    {
      key: OrderStatus.DELIVERED,
      title: "DELIVERED",
      value: orders.filter((o: any) => o.status === OrderStatus.DELIVERED)
        .length,
      icon: Send,
      color: "text-indigo-500",
    },
    {
      key: OrderStatus.COMPLETED,
      title: "COMPLETED",
      value: orders.filter((o: any) => o.status === OrderStatus.COMPLETED)
        .length,
      icon: BadgeCheck,
      color: "text-green-600",
    },
    {
      key: OrderStatus.CANCEL,
      title: "CANCEL",
      value: orders.filter((o: any) => o.status === OrderStatus.CANCEL).length,
      icon: Ban,
      color: "text-red-600",
    },
    {
      key: OrderStatus.REFUND,
      title: "REFUND",
      value: orders.filter((o: any) => o.status === OrderStatus.CANCEL).length,
      icon: RefreshCcw,
      color: "text-red-600",
    },
    {
      key: "TOTAL_ORDERS",
      title: "TOTAL ORDERS",
      value: orders.length,
      icon: FileText,
      color: "text-blue-600",
    },
    {
      key: "TOTAL_REVENUE",
      title: "TOTAL REVENUE",
      value: `${totalRevenue.toLocaleString()} USD`,
      icon: DollarSign,
      color: "text-emerald-600",
    },
  ];

  const filteredStats = requiredStatus
    ? stats.filter((s) => requiredStatus.includes(s.key))
    : stats;

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-8">
      {filteredStats.map((stat) => (
        <Card key={stat.key} className="flex h-fit gap-0 gap-y-1 py-3">
          <CardContent>
            <div className="text-xl font-bold break-all">{stat.value}</div>
          </CardContent>{" "}
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium break-all">
              {stat.title}
            </CardTitle>
            <stat.icon className={cn("h-5 w-5", stat.color)} />
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
