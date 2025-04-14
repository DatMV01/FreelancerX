"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import { BadgeDollarSign, Banknote, FileDown } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function FreelancerEarnings() {
  const [month, setMonth] = useState("04");
  const [year, setYear] = useState("2025");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [summary, setSummary] = useState({ total: 0, balance: 0 });

  useEffect(() => {
    const fakeResponse = {
      totalEarnings: 1250,
      availableBalance: 670,
      transactions: [
        {
          id: "1",
          date: `${year}-${month}-01`,
          type: "Gig",
          amount: 200,
          status: "Đã thanh toán",
        },
        {
          id: "2",
          date: `${year}-${month}-04`,
          type: "Bonus",
          amount: 50,
          status: "Đã thanh toán",
        },
        {
          id: "3",
          date: `${year}-${month}-07`,
          type: "Gig",
          amount: 300,
          status: "Đã thanh toán",
        },
        {
          id: "4",
          date: `${year}-${month}-14`,
          type: "Refund",
          amount: -100,
          status: "Đã hoàn lại",
        },
        {
          id: "5",
          date: `${year}-${month}-22`,
          type: "Gig",
          amount: 400,
          status: "Đã thanh toán",
        },
        {
          id: "6",
          date: `${year}-${month}-27`,
          type: "Gig",
          amount: 400,
          status: "Đã thanh toán",
        },
      ],
    };

    setData(fakeResponse.transactions);
    setSummary({
      total: fakeResponse.totalEarnings,
      balance: fakeResponse.availableBalance,
    });
  }, [month, year]);

  const handleExportCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, "Earnings");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `earnings_${month}_${year}.xlsx`);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Thu nhập Freelancer", 14, 16);
    autoTable(doc, {
      head: [["Ngày", "Loại", "Số tiền", "Trạng thái"]],
      body: data.map((tx) => [
        tx.date,
        tx.type,
        `${tx.amount < 0 ? "-" : ""}$${Math.abs(tx.amount)}`,
        tx.status,
      ]),
      startY: 20,
    });
    doc.save(`earnings_${month}_${year}.pdf`);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4">
      <h1 className="text-2xl font-semibold">💵 Thu nhập Freelancer</h1>

      {/* Tổng quan */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-green-100 p-3 text-green-700">
              <BadgeDollarSign />
            </div>
            <div>
              <div className="text-muted-foreground text-sm">Tổng thu nhập</div>
              <div className="text-xl font-semibold">${summary.total}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-blue-100 p-3 text-blue-700">
                <Banknote />
              </div>
              <div>
                <div className="text-muted-foreground text-sm">
                  Số dư khả dụng
                </div>
                <div className="text-xl font-semibold">${summary.balance}</div>
              </div>
            </div>
            <Button variant="secondary">Rút tiền</Button>
          </CardContent>
        </Card>
      </div>

      {/* Bộ lọc */}
      <div className="flex flex-wrap items-center gap-4">
        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Tháng" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }, (_, i) => {
              const m = `${i + 1}`.padStart(2, "0");
              return (
                <SelectItem key={m} value={m}>
                  Tháng {m}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Năm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2025">2025</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
          </SelectContent>
        </Select>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          placeholderText="Từ ngày"
          className="rounded-md border px-3 py-2 text-sm"
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          placeholderText="Đến ngày"
          className="rounded-md border px-3 py-2 text-sm"
        />
        <div className="ml-auto flex gap-2">
          <Button variant="outline" onClick={handleExportPDF}>
            <FileDown className="mr-2 h-4 w-4" />
            Xuất PDF
          </Button>
          <Button onClick={handleExportCSV}>
            <FileDown className="mr-2 h-4 w-4" />
            Xuất CSV
          </Button>
        </div>
      </div>

      {/* Biểu đồ */}
      <Card>
        <CardHeader>
          <CardTitle>Biểu đồ thu nhập</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#34d399" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bảng giao dịch */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử giao dịch</CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ngày</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{tx.date}</TableCell>
                  <TableCell>{tx.type}</TableCell>
                  <TableCell
                    className={
                      tx.amount < 0 ? "text-red-600" : "text-green-600"
                    }
                  >
                    {tx.amount < 0 ? `-$${-tx.amount}` : `$${tx.amount}`}
                  </TableCell>
                  <TableCell>{tx.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
