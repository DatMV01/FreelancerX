import {
     Card,
     CardContent,
     CardHeader,
     CardTitle
   } from "@/components/ui/card";
   import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
   import { Loader2, Briefcase, BadgeDollarSign, Star, Users } from "lucide-react";
   import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
   import { useEffect, useState } from "react";
   
   // Mock data
   const MOCK_STATS = {
     totalOrders: 48,
     activeOrders: 7,
     earnings: 2150,
     rating: 4.8,
   };
   
   const MOCK_CHARTS: Record<string, { month: string; revenue: number }[]> = {
     "2023": [
       { month: "Q1", revenue: 1200 },
       { month: "Q2", revenue: 1500 },
       { month: "Q3", revenue: 1800 },
       { month: "Q4", revenue: 2200 },
     ],
     "2024": [
       { month: "Q1", revenue: 1800 },
       { month: "Q2", revenue: 2100 },
       { month: "Q3", revenue: 2450 },
       { month: "Q4", revenue: 3000 },
     ],
   };
   
   const MOCK_TOP_SERVICES = [
     { name: "Thiết kế logo", orders: 25 },
     { name: "Viết content SEO", orders: 18 },
     { name: "Dịch thuật Anh-Việt", orders: 10 },
   ];
   
   const MOCK_TOP_CLIENTS = [
     { name: "Nguyễn Văn A", totalSpent: 400 },
     { name: "Trần Thị B", totalSpent: 280 },
     { name: "Lê Văn C", totalSpent: 230 },
   ];
   
   export default function FreelancerOverview() {
     const [loading, setLoading] = useState(true);
     const [stats, setStats] = useState(MOCK_STATS);
     const [year, setYear] = useState("2024");
     const [chartData, setChartData] = useState(MOCK_CHARTS["2024"]);
   
     useEffect(() => {
       const timeout = setTimeout(() => {
         setLoading(false);
       }, 800);
       return () => clearTimeout(timeout);
     }, []);
   
     useEffect(() => {
       setChartData(MOCK_CHARTS[year]);
     }, [year]);
   
     if (loading) {
       return (
         <div className="flex justify-center items-center h-64">
           <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
         </div>
       );
     }
   
     return (
       <div className="space-y-6 px-4">
         <h1 className="text-2xl font-semibold">👨‍💻 Tổng quan Freelancer</h1>
   
         {/* Stats */}
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
           <StatCard icon={<Briefcase />} title="Tổng đơn" value={stats.totalOrders} />
           <StatCard icon={<BadgeDollarSign />} title="Thu nhập" value={`$${stats.earnings}`} />
           <StatCard icon={<Briefcase className="text-yellow-500" />} title="Đơn đang làm" value={stats.activeOrders} />
           <StatCard icon={<Star className="text-yellow-400" />} title="Đánh giá" value={`${stats.rating} ★`} />
         </div>
   
         {/* Chart */}
         <Card>
           <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
               <BarChart data={chartData}>
                 <XAxis dataKey="month" />
                 <YAxis />
                 <Tooltip />
                 <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
           </CardContent>
         </Card>
   
         {/* Top Services & Clients */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <Card>
             <CardHeader>
               <CardTitle>🔥 Top dịch vụ</CardTitle>
             </CardHeader>
             <CardContent>
               <ul className="space-y-2">
                 {MOCK_TOP_SERVICES.map((s, i) => (
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
                 {MOCK_TOP_CLIENTS.map((c, i) => (
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
   
   function StatCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string | number }) {
     return (
       <Card>
         <CardContent className="flex items-center gap-4 py-6">
           <div className="p-3 rounded-full bg-muted text-primary">{icon}</div>
           <div>
             <div className="text-sm text-muted-foreground">{title}</div>
             <div className="text-xl font-semibold">{value}</div>
           </div>
         </CardContent>
       </Card>
     );
   }
   