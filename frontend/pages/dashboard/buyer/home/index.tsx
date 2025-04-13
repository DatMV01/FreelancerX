import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, PackageCheck, Clock, Heart, Divide } from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { ReactElement } from "react";
import BuyerOverviewWeekly from "@/features/dashboard/buyer/components/BuyerOverviewWeekly";
import BuyerOverviewMonthly from "@/features/dashboard/buyer/components/BuyerOverviewMonthly";
import { Divider } from "@mui/material";

const chartData = [
  [
    // Completed Orders
    { name: "Mon", value: 1 },
    { name: "Tue", value: 3 },
    { name: "Wed", value: 5 },
    { name: "Thu", value: 6 },
    { name: "Fri", value: 8 },
    { name: "Sat", value: 10 },
    { name: "Sun", value: 14 },
  ],
  [
    // Processing Orders
    { name: "Mon", value: 1 },
    { name: "Tue", value: 2 },
    { name: "Wed", value: 2 },
    { name: "Thu", value: 3 },
    { name: "Fri", value: 2 },
    { name: "Sat", value: 3 },
    { name: "Sun", value: 3 },
  ],
  [
    // Spending
    { name: "Mon", value: 50 },
    { name: "Tue", value: 150 },
    { name: "Wed", value: 200 },
    { name: "Thu", value: 300 },
    { name: "Fri", value: 350 },
    { name: "Sat", value: 500 },
    { name: "Sun", value: 1250 },
  ],
  [
    // Favorites
    { name: "Mon", value: 1 },
    { name: "Tue", value: 2 },
    { name: "Wed", value: 4 },
    { name: "Thu", value: 5 },
    { name: "Fri", value: 6 },
    { name: "Sat", value: 7 },
    { name: "Sun", value: 7 },
  ],
];

const stats = [
  {
    label: "Đơn đã hoàn thành",
    value: 14,
    icon: <PackageCheck className="h-5 w-5 text-green-600" />,
    color: "#22c55e",
  },
  {
    label: "Đơn đang xử lý",
    value: 3,
    icon: <Clock className="h-5 w-5 text-yellow-500" />,
    color: "#eab308",
  },
  {
    label: "Tổng chi tiêu",
    value: "$1,250",
    icon: <DollarSign className="h-5 w-5 text-blue-600" />,
    color: "#3b82f6",
  },
];

export default function BuyerDashboardHome() {
  return (
    <div className=" ">
      <BuyerOverviewWeekly />

      <Divider className="py-4"/>
      <BuyerOverviewMonthly />
    </div>
  );
}

BuyerDashboardHome.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
