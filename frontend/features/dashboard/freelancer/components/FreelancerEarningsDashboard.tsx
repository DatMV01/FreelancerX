import { useState } from "react";
import useSWR from "swr";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Wallet, Banknote, Hourglass } from "lucide-react";
import { saveAs } from "file-saver";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function FreelancerEarningsDashboard() {
  const [year, setYear] = useState("2025");
  const { data, isLoading } = useSWR(
    `/api/freelancer/earnings?year=${year}`,
    fetcher,
  );

  const summary = data?.summary || {};
  const chartData = data?.monthly || [];
  const transactions = data?.transactions || [];
  const withdrawals = data?.withdrawals || [];

  const exportCSV = () => {
    const csv = [
      ["Ngày", "Gig", "Buyer", "Trạng thái", "Số tiền"],
      ...transactions.map((tx) => [
        tx.date,
        tx.gig,
        tx.buyer,
        tx.status,
        tx.amount,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `thu-nhap-${year}.csv`);
  };

  return (
    <div className="space-y-6">
      {/* Tổng quan */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="flex flex-col gap-1 p-4">
          <span className="text-muted-foreground text-sm">Tổng thu nhập</span>
          <span className="flex items-center gap-2 text-xl font-semibold">
            <Wallet className="h-5 w-5" />{" "}
            {summary.totalIncome?.toLocaleString()}₫
          </span>
        </Card>
        <Card className="flex flex-col gap-1 p-4">
          <span className="text-muted-foreground text-sm">Đã rút</span>
          <span className="flex items-center gap-2 text-xl font-semibold">
            <Banknote className="h-5 w-5" />{" "}
            {summary.totalWithdrawn?.toLocaleString()}₫
          </span>
        </Card>
        <Card className="flex flex-col gap-1 p-4">
          <span className="text-muted-foreground text-sm">Đơn đang xử lý</span>
          <span className="flex items-center gap-2 text-xl font-semibold">
            <Hourglass className="h-5 w-5" />{" "}
            {summary.pendingAmount?.toLocaleString()}₫
          </span>
        </Card>
        <Card className="flex flex-col gap-1 p-4">
          <span className="text-muted-foreground text-sm">Số dư khả dụng</span>
          <span className="text-xl font-semibold">
            {summary.available?.toLocaleString()}₫
          </span>
        </Card>
      </div>

      {/* Biểu đồ */}
      <Card className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Thu nhập theo tháng</h2>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Chọn năm" />
            </SelectTrigger>
            <SelectContent>
              {["2025", "2024", "2023"].map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(v) => `${v / 1_000_000}tr`} />
            <Tooltip
              formatter={(value: number) => `${value.toLocaleString()}₫`}
            />
            <Bar dataKey="total" fill="#4f46e5" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Giao dịch chi tiết */}
      <Card className="p-4">
        <div className="mb-4 flex justify-between">
          <h3 className="text-lg font-semibold">Danh sách đơn thu nhập</h3>
          <Button onClick={exportCSV}>Xuất CSV</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Ngày</TableCell>
              <TableCell>Gig</TableCell>
              <TableCell>Buyer</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Số tiền</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx, i) => (
              <TableRow key={i}>
                <TableCell>{tx.date}</TableCell>
                <TableCell>{tx.gig}</TableCell>
                <TableCell>{tx.buyer}</TableCell>
                <TableCell>{tx.status}</TableCell>
                <TableCell>{tx.amount.toLocaleString()}₫</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Rút tiền */}
      <Card className="space-y-4 p-4">
        <h3 className="text-lg font-semibold">Rút tiền</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input placeholder="Nhập số tiền muốn rút (₫)" />
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Chọn tài khoản nhận" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="momo">Momo - 098xxxxxxx</SelectItem>
              <SelectItem value="vcb">Vietcombank - 1234</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="mt-2">Xác nhận rút tiền</Button>
      </Card>

      {/* Lịch sử rút tiền */}
      <Card className="p-4">
        <h3 className="mb-4 text-lg font-semibold">Lịch sử rút tiền</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Ngày</TableCell>
              <TableCell>Phương thức</TableCell>
              <TableCell>Số tiền</TableCell>
              <TableCell>Trạng thái</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {withdrawals.map((w, i) => (
              <TableRow key={i}>
                <TableCell>{w.date}</TableCell>
                <TableCell>{w.method}</TableCell>
                <TableCell>{w.amount.toLocaleString()}₫</TableCell>
                <TableCell>{w.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
