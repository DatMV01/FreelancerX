import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ManageGigs() {
  const gigs = [
    { id: 1, title: "Web Development", price: 100, status: "Active", views: 50, orders: 5, rating: 4.5, date: "2025-04-01" },
    { id: 2, title: "Graphic Design", price: 50, status: "Pending", views: 30, orders: 2, rating: 4.0, date: "2025-03-15" },
    { id: 3, title: "SEO Services", price: 80, status: "Active", views: 120, orders: 8, rating: 4.7, date: "2025-02-10" },
  ];

  const [status, setStatus] = useState("All");
  const [month, setMonth] = useState("All");
  const [year, setYear] = useState("All");

  const filtered = gigs.filter((gig) => {
    const gigDate = new Date(gig.date);
    return (
      (status === "All" || gig.status === status) &&
      (month === "All" || gigDate.getMonth() + 1 === Number(month)) &&
      (year === "All" || gigDate.getFullYear() === Number(year))
    );
  });

  const revenue = filtered.reduce((sum, g) => sum + g.price * g.orders, 0);
  const orders = filtered.reduce((sum, g) => sum + g.orders, 0);
  const views = filtered.reduce((sum, g) => sum + g.views, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🎛️ Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select onValueChange={setStatus} defaultValue="All">
            <SelectTrigger>
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Tất cả</SelectItem>
              <SelectItem value="Active">Hoạt động</SelectItem>
              <SelectItem value="Pending">Chờ duyệt</SelectItem>
              <SelectItem value="Paused">Tạm dừng</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={setMonth} defaultValue="All">
            <SelectTrigger>
              <SelectValue placeholder="Tháng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Tất cả</SelectItem>
              {[...Array(12)].map((_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  Tháng {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={setYear} defaultValue="All">
            <SelectTrigger>
              <SelectValue placeholder="Năm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Tất cả</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Tổng Doanh Thu</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">${revenue}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tổng Đơn Hàng</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{orders}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tổng Lượt Xem</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{views}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>📋 Danh sách Gigs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên Gig</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Lượt xem</TableHead>
                <TableHead>Đơn hàng</TableHead>
                <TableHead>Đánh giá</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((gig) => (
                <TableRow key={gig.id}>
                  <TableCell>{gig.title}</TableCell>
                  <TableCell>${gig.price}</TableCell>
                  <TableCell>{gig.status}</TableCell>
                  <TableCell>{gig.views}</TableCell>
                  <TableCell>{gig.orders}</TableCell>
                  <TableCell>{gig.rating}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
