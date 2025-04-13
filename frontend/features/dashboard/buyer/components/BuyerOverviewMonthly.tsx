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
   import { DollarSign, PackageCheck, Clock, Heart } from "lucide-react";
   import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
   import { useState } from "react";
   
   const pieChartData = [
     { name: "UI/UX", value: 3 },
     { name: "SEO", value: 2 },
     { name: "Translation", value: 2 },
   ];
   
   const pieColors = ["#ec4899", "#f472b6", "#fb7185"];
   
   const fetcher = (url: string) => fetch(url).then((res) => res.json());

   
   const barDataByMonth = [
     // Completed Orders
     [
       { name: "Jan", value: 2 }, { name: "Feb", value: 4 }, { name: "Mar", value: 5 },
       { name: "Apr", value: 7 }, { name: "May", value: 9 }, { name: "Jun", value: 12 },
       { name: "Jul", value: 14 }, { name: "Aug", value: 11 }, { name: "Sep", value: 13 },
       { name: "Oct", value: 15 }, { name: "Nov", value: 16 }, { name: "Dec", value: 18 },
     ],
     // Processing Orders
     [
       { name: "Jan", value: 1 }, { name: "Feb", value: 1 }, { name: "Mar", value: 2 },
       { name: "Apr", value: 2 }, { name: "May", value: 3 }, { name: "Jun", value: 2 },
       { name: "Jul", value: 3 }, { name: "Aug", value: 2 }, { name: "Sep", value: 4 },
       { name: "Oct", value: 3 }, { name: "Nov", value: 2 }, { name: "Dec", value: 3 },
     ],
     // Spending
     [
       { name: "Jan", value: 100 }, { name: "Feb", value: 200 }, { name: "Mar", value: 250 },
       { name: "Apr", value: 300 }, { name: "May", value: 400 }, { name: "Jun", value: 500 },
       { name: "Jul", value: 550 }, { name: "Aug", value: 650 }, { name: "Sep", value: 700 },
       { name: "Oct", value: 800 }, { name: "Nov", value: 900 }, { name: "Dec", value: 1250 },
     ],
   ];
   
   const barDataByQuarter = [
     // Completed Orders
     [
       { name: "Q1", value: 11 }, { name: "Q2", value: 28 },
       { name: "Q3", value: 38 }, { name: "Q4", value: 49 },
     ],
     // Processing Orders
     [
       { name: "Q1", value: 4 }, { name: "Q2", value: 6 },
       { name: "Q3", value: 9 }, { name: "Q4", value: 7 },
     ],
     // Spending
     [
       { name: "Q1", value: 550 }, { name: "Q2", value: 1200 },
       { name: "Q3", value: 1900 }, { name: "Q4", value: 2950 },
     ],
   ];
   
   const stats = [
     {
       label: "Đơn đã hoàn thành",
       value: 18,
       icon: <PackageCheck className="w-5 h-5 text-green-600" />,
       color: "#22c55e",
       type: "bar",
       dataIndex: 0,
     },
     {
       label: "Đơn đang xử lý",
       value: 3,
       icon: <Clock className="w-5 h-5 text-yellow-500" />,
       color: "#eab308",
       type: "bar",
       dataIndex: 1,
     },
     {
       label: "Tổng chi tiêu",
       value: "$1,250",
       icon: <DollarSign className="w-5 h-5 text-blue-600" />,
       color: "#3b82f6",
       type: "bar",
       dataIndex: 2,
     },
     // {
     //   label: "Gig đã lưu",
     //   value: 7,
     //   icon: <Heart className="w-5 h-5 text-pink-500" />,
     //   color: "#ec4899",
     //   type: "pie",
     // },
   ];
   
   export default function BuyerOverview() {
     const [year, setYear] = useState("2024");
     const [view, setView] = useState<"month" | "quarter">("month");
   
     const barData = view === "month" ? barDataByMonth : barDataByQuarter;
   
     return (
       <div className="space-y-4">
         {/* Bộ lọc */}
         <div className="flex items-center gap-4">
           <Select value={year} onValueChange={setYear}>
             <SelectTrigger className="w-[120px]">
               <SelectValue placeholder="Chọn năm" />
             </SelectTrigger>
             <SelectContent>
               {["2023", "2024", "2025"].map((y) => (
                 <SelectItem key={y} value={y}>{y}</SelectItem>
               ))}
             </SelectContent>
           </Select>
   
           <Select value={view} onValueChange={(v) => setView(v as "month" | "quarter")}>
             <SelectTrigger className="w-[140px]">
               <SelectValue placeholder="Hiển thị" />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="month">Theo tháng</SelectItem>
               <SelectItem value="quarter">Theo quý</SelectItem>
             </SelectContent>
           </Select>
         </div>
   
         {/* Grid thống kê */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
           {stats.map((item, index) => (
             <Card key={index} className="p-4 shadow-sm space-y-2">
               <div className="flex items-center gap-3">
                 {item.icon}
                 <div>
                   <div className="text-sm text-muted-foreground">{item.label}</div>
                   <div className="text-lg font-semibold">{item.value}</div>
                 </div>
               </div>
   
               <div className="h-[100px] -mb-2">
                 <ResponsiveContainer width="100%" height="100%">
                   {item.type === "bar" ? (
                     <BarChart data={barData[item.dataIndex]}>
                       <Tooltip wrapperStyle={{ zIndex: 50 }} />
                       <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                       <Bar dataKey="value" fill={item.color} radius={[4, 4, 0, 0]} />
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
                           <Cell key={`cell-${i}`} fill={pieColors[i % pieColors.length]} />
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
   