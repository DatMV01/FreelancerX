 
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CardContent } from "@mui/material";
import { BadgeDollarSign, Banknote } from "lucide-react";
import { useState } from "react";

const mockTransactions = [
  {
    id: 1,
    date: "2025-04-01",
    type: "Order",
    amount: 200,
    status: "Completed",
  },
  {
    id: 2,
    date: "2025-04-05",
    type: "Withdraw",
    amount: -150,
    status: "Success",
  },
  { id: 3, date: "2025-04-10", type: "Bonus", amount: 50, status: "Completed" },
];

export default function FreelancerEarnings() {
  const [month, setMonth] = useState("04");
  const [year, setYear] = useState("2025");

  const totalEarnings = 3200;
  const availableBalance = 950;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4">
      <h1 className="text-2xl font-semibold">💵 Thu nhập Freelancer</h1>

      {/* Earnings Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-green-100 p-3 text-green-700">
              <BadgeDollarSign />
            </div>
            <div>
              <div className="text-muted-foreground text-sm">Tổng thu nhập</div>
              <div className="text-xl font-semibold">${totalEarnings}</div>
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
                <div className="text-xl font-semibold">${availableBalance}</div>
              </div>
            </div>
            <Button variant="secondary">Rút tiền</Button>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Chọn tháng" />
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
            <SelectValue placeholder="Chọn năm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2025">2025</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Transaction History */}
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
              {mockTransactions.map((tx) => (
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
