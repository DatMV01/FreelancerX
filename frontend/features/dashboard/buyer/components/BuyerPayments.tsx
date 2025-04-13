import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Download } from "lucide-react";

export default function BuyerPayments() {
  // fake data
  const paymentMethods = [
    { id: "1", type: "Visa", last4: "1234", expiry: "12/26" },
    { id: "2", type: "PayPal", email: "buyer@example.com" },
  ];

  const transactions = [
    {
      id: "T001",
      date: "2024-03-10",
      amount: 50,
      method: "Visa",
      status: "Đã thanh toán",
    },
    {
      id: "T002",
      date: "2024-02-25",
      amount: 120,
      method: "PayPal",
      status: "Đã thanh toán",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4">
      <h1 className="text-2xl font-semibold">
        💳 Thanh toán & Lịch sử giao dịch
      </h1>

      {/* Phương thức thanh toán */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Phương thức thanh toán</CardTitle>
          <Button variant="outline" size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm phương thức
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between rounded-lg border px-4 py-2"
            >
              <div>
                <div className="font-medium">{method.type}</div>
                <div className="text-muted-foreground text-sm">
                  {method.last4
                    ? `•••• ${method.last4} - Hết hạn ${method.expiry}`
                    : method.email}
                </div>
              </div>
              <Button variant="ghost" size="sm">
                Xóa
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Lịch sử giao dịch */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lịch sử giao dịch</CardTitle>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Xuất hóa đơn
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã giao dịch</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Phương thức</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{tx.id}</TableCell>
                  <TableCell>{tx.date}</TableCell>
                  <TableCell>${tx.amount}</TableCell>
                  <TableCell>{tx.method}</TableCell>
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
