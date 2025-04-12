"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import useSWR from "swr";
import { format, parseISO } from "date-fns";
import { fetchOrders } from "../fakeApi";

type Order = {
  id: string;
  status: "pending" | "done" | "canceled";
  createdAt: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type MonthlyStats = {
  month: string;
  pending: number;
  done: number;
  canceled: number;
};

export default function OrderChart() {
  const { data: orders, isLoading } = useSWR("/api/orders", fetchOrders);

  if (isLoading || !orders) {
    return <p className="text-muted-foreground text-sm">Đang tải biểu đồ...</p>;
  }

  // Group orders by month & status
  const monthlyMap = new Map<string, MonthlyStats>();

  orders.forEach((order) => {
    
    const date = parseISO(order.createdAt);
    const month = format(date, "yyyy-MM");

    if (!monthlyMap.has(month)) {
      monthlyMap.set(month, { month, pending: 0, done: 0, canceled: 0 });
    }

    const current = monthlyMap.get(month)!;
    current[order.status]++;
  });

  const chartData = Array.from(monthlyMap.values()).sort((a, b) =>
    a.month.localeCompare(b.month),
  );

  return (
    <div className="mt-6 h-[300px] w-full">
      <h3 className="mb-2 text-lg font-semibold">Thống kê đơn theo tháng</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="pending" stackId="a" fill="#facc15" name="Đang chờ" />
          <Bar dataKey="done" stackId="a" fill="#4ade80" name="Hoàn thành" />
          <Bar dataKey="canceled" stackId="a" fill="#f87171" name="Hủy" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
