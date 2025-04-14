"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { Card } from "@/components/ui/card";
import { DollarSign, PackageCheck, Clock, Heart, XCircle } from "lucide-react";

const barChartData = [
  [
    { name: "Mon", value: 1 },
    { name: "Tue", value: 3 },
    { name: "Wed", value: 5 },
    { name: "Thu", value: 6 },
    { name: "Fri", value: 8 },
    { name: "Sat", value: 10 },
    { name: "Sun", value: 14 },
  ],
  [
    { name: "Mon", value: 1 },
    { name: "Tue", value: 2 },
    { name: "Wed", value: 2 },
    { name: "Thu", value: 3 },
    { name: "Fri", value: 2 },
    { name: "Sat", value: 3 },
    { name: "Sun", value: 3 },
  ],
  [
    { name: "Mon", value: 50 },
    { name: "Tue", value: 150 },
    { name: "Wed", value: 200 },
    { name: "Thu", value: 300 },
    { name: "Fri", value: 350 },
    { name: "Sat", value: 500 },
    { name: "Sun", value: 1250 },
  ],
];

const pieChartData = [
  { name: "UI/UX", value: 3 },
  { name: "SEO", value: 2 },
  { name: "Translation", value: 2 },
];

const pieColors = ["#ec4899", "#f472b6", "#fb7185"];

const stats = [
  {
    label: "Đơn đã hoàn thành",
    value: 14,
    icon: <PackageCheck className="h-5 w-5 text-green-600" />,
    color: "#22c55e",
    type: "bar",
    dataIndex: 0,
  },
  {
    label: "Đơn đang xử lý",
    value: 3,
    icon: <Clock className="h-5 w-5 text-yellow-500" />,
    color: "#eab308",
    type: "bar",
    dataIndex: 1,
  },

  {
    label: "Đã hủy",
    value: 7,
    icon: <XCircle className="h-5 w-5 text-pink-500" />,
    color: "#ec4899",
    type: "pie",
  },

  {
    label: "Tổng chi tiêu",
    value: "$1,250",
    icon: <DollarSign className="h-5 w-5 text-blue-600" />,
    color: "#3b82f6",
    type: "bar",
    dataIndex: 2,
  },

];

export default function BuyerOverviewWeekly() {
  return (
    <div>
      <p className="font-bold py-2">Weekly Report</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {stats.map((item, index) => (
          <Card key={index} className="space-y-2 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              {item.icon}
              <div>
                <div className="text-muted-foreground text-sm">
                  {item.label}
                </div>
                <div className="text-lg font-semibold">{item.value}</div>
              </div>
            </div>

            <div className="-mb-2 h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                {item.type === "bar" ? (
                  <BarChart data={barChartData[item.dataIndex]}>
                    <Tooltip wrapperStyle={{ zIndex: 50 }} />
                    <XAxis dataKey="name" hide />
                    <Bar
                      dataKey="value"
                      fill={item.color}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                ) : (
                  <PieChart>
                    <Tooltip wrapperStyle={{ zIndex: 50 }} />
                    <Pie
                      data={pieChartData}
                      dataKey="value"
                      outerRadius={30}
                      innerRadius={18}
                      stroke="none"
                    >
                      {pieChartData.map((entry, i) => (
                        <Cell
                          key={`cell-${i}`}
                          fill={pieColors[i % pieColors.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                )}
              </ResponsiveContainer>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
