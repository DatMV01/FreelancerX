import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, PackageCheck, Clock, XCircle, DollarSign, Heart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Bar,
  ResponsiveContainer,
} from "recharts";

export default function BuyerDashboard() {
  const stats = [
    { label: "Đã hoàn thành", value: 12, icon: <PackageCheck className="w-5 h-5 text-green-600" /> },
    { label: "Đang xử lý", value: 2, icon: <Clock className="w-5 h-5 text-yellow-500" /> },
    { label: "Đã huỷ", value: 1, icon: <XCircle className="w-5 h-5 text-red-500" /> },
    { label: "Tổng chi tiêu", value: "$845", icon: <DollarSign className="w-5 h-5 text-blue-600" /> },
    { label: "Đã lưu", value: 5, icon: <Heart className="w-5 h-5 text-pink-500" /> },
  ];

  const recentOrders = [
    {
      id: 1,
      gig: "Thiết kế logo chuyên nghiệp",
      status: "Đang xử lý",
      freelancer: "@john_doe",
      price: "$120",
    },
    {
      id: 2,
      gig: "Viết content chuẩn SEO",
      status: "Đã hoàn thành",
      freelancer: "@emma_writer",
      price: "$90",
    },
  ];

  const messages = [
    {
      from: "@john_doe",
      preview: "Mình đã gửi file logo, bạn xem giúp nhé!",
    },
    {
      from: "@emma_writer",
      preview: "Cần thêm từ khoá nào không bạn?",
    },
  ];

  const pieData = [
    { name: "Đã hoàn thành", value: 12 },
    { name: "Đang xử lý", value: 2 },
    { name: "Đã huỷ", value: 1 },
  ];
  const pieColors = ["#22c55e", "#facc15", "#ef4444"];

  const barData = [
    { month: "Th1", total: 120 },
    { month: "Th2", total: 200 },
    { month: "Th3", total: 75 },
    { month: "Th4", total: 150 },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Stats section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((s, i) => (
          <Card key={i} className="flex items-center gap-3 p-4">
            {s.icon}
            <div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
              <div className="text-lg font-semibold">{s.value}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Tỉ lệ đơn hàng</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Chi tiêu theo tháng</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Orders */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Đơn hàng gần đây</h2>
        <Separator className="mb-4" />
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <Card key={order.id} className="p-4 flex justify-between items-center">
              <div>
                <div className="font-medium">{order.gig}</div>
                <div className="text-sm text-muted-foreground">
                  {order.freelancer} • <Badge>{order.status}</Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-base font-semibold">{order.price}</div>
                <Button variant="outline" size="sm" className="mt-1">Xem chi tiết</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Messages */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Tin nhắn gần đây</h2>
        <Separator className="mb-4" />
        <div className="space-y-3">
          {messages.map((msg, index) => (
            <div key={index} className="flex items-start gap-3 p-3 border rounded-xl bg-muted/30">
              <MessageSquare className="w-5 h-5 text-muted-foreground mt-1" />
              <div>
                <div className="font-medium">{msg.from}</div>
                <div className="text-sm text-muted-foreground">{msg.preview}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
