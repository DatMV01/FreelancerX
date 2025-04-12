"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  BadgeCheck,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Hammer,
  Hourglass,
  Loader2,
  RotateCcw,
  Send,
  Truck,
  XCircle,
} from "lucide-react";
import { OrderStatus } from "../dto";

export default function OrderStatsDashboard({ orders }: { orders: any }) {
  if (!orders) {
    return (
      <p className="text-muted-foreground text-sm">Đang tải thống kê...</p>
    );
  }

  const totalRevenue = orders
    .filter((o: any) => o.status === OrderStatus.COMPLETED)
    .reduce((sum: number, o: any) => sum + Number(o.totalAmount), 0);

  const stats = [
    {
      title: "TOTAL ORDERS",
      value: orders.length,
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "PENDING",
      value: orders.filter((o: any) => o.status === OrderStatus.PENDING).length,
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      title: "PAID",
      value: orders.filter((o: any) => o.status === OrderStatus.PAID).length,
      icon: DollarSign,
      color: "text-emerald-600",
    },
    {
      title: "IN PROGRESS",
      value: orders.filter((o: any) => o.status === OrderStatus.IN_PROGRESS)
        .length,
      icon: Hammer,
      color: "text-orange-500",
    },
    {
      title: "DELIVERED",
      value: orders.filter((o: any) => o.status === OrderStatus.DELIVERED)
        .length,
      icon: Send,
      color: "text-indigo-500",
    },
    {
      title: "COMPLETED",
      value: orders.filter((o: any) => o.status === OrderStatus.COMPLETED)
        .length,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "CANCELED",
      value: orders.filter((o: any) => o.status === OrderStatus.CANCELED)
        .length,
      icon: XCircle,
      color: "text-red-600",
    },
    {
      title: "REFUNDED",
      value: orders.filter((o: any) => o.status === OrderStatus.REFUNDED)
        .length,
      icon: RotateCcw,
      color: "text-gray-500",
    },
    {
      title: "TOTAL REVENUE",
      value: `${totalRevenue.toLocaleString()} USD`,
      icon: DollarSign,
      color: "text-emerald-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={cn("h-5 w-5", stat.color)} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
