import useSWR from "swr";

import { Loader2, Briefcase, BadgeDollarSign, Star } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchStats, fetchTopClient, fetchTopService } from "@/features/order/fakeApi";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function FreelancerOverview() {
  const [year, setYear] = useState("2024");

  const { data: stats, isLoading: loadingStats } = useSWR(
    `/api/freelancer/stats?year=${year}`,
    fetchStats,
  );
  const { data: topServices } = useSWR(
    `/api/freelancer/top-services`,
    fetchTopService,
  );
  const { data: topClients } = useSWR(
    `/api/freelancer/top-clients`,
    fetchTopClient,
  );

  if (loadingStats || !stats) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4">
      <h1 className="text-2xl font-semibold">👨‍💻 Tổng quan Freelancer</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <StatCard
          icon={<Briefcase />}
          title="Tổng đơn"
          value={stats.totalOrders}
        />
        <StatCard
          icon={<BadgeDollarSign />}
          title="Thu nhập"
          value={`$${stats.earnings}`}
        />
        <StatCard
          icon={<Briefcase className="text-yellow-500" />}
          title="Đơn đang làm"
          value={stats.activeOrders}
        />
        <StatCard
          icon={<Star className="text-yellow-400" />}
          title="Đánh giá"
          value={`${stats.rating} ★`}
        />
      </div>

      {/* Chart */}
      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle>Doanh thu theo quý</CardTitle>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Chọn năm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.chartData}>
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Services & Clients */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>🔥 Top dịch vụ</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {topServices?.map((s: any, i: number) => (
                <li key={i} className="flex justify-between">
                  <span>{s.name}</span>
                  <span className="text-muted-foreground">{s.orders} đơn</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🏆 Top khách hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {topClients?.map((c: any, i: number) => (
                <li key={i} className="flex justify-between">
                  <span>{c.name}</span>
                  <span className="text-muted-foreground">${c.totalSpent}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 py-6">
        <div className="bg-muted text-primary rounded-full p-3">{icon}</div>
        <div>
          <div className="text-muted-foreground text-sm">{title}</div>
          <div className="text-xl font-semibold">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}
