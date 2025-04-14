import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function WithdrawSection() {
  const [balance, setBalance] = useState(620);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [history, setHistory] = useState([]);

  const handleRequest = () => {
    const amount = parseFloat(withdrawAmount);

    if (!selectedAccount) {
      toast.error("Chưa chọn phương thức rút", {
        description: "Vui lòng chọn ngân hàng hoặc ví điện tử.",
      });
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      toast.error("Số tiền không hợp lệ", {
        description: "Vui lòng nhập số tiền hợp lệ để rút.",
      });
      return;
    }

    if (amount > balance) {
      toast.error("Số dư không đủ", {
        description: "Bạn không thể rút nhiều hơn số dư hiện có.",
      });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const date = new Date().toLocaleString();
      const method = selectedAccount;

      // Không trừ tiền ngay, chỉ lưu yêu cầu
      setHistory((prev) => [
        ...prev,
        {
          amount,
          method,
          date,
          status: "Đang chờ admin duyệt",
        },
      ]);
      setWithdrawAmount("");
      setSelectedAccount("");
      setIsLoading(false);

      toast.success("Đã gửi yêu cầu", {
        description: `Yêu cầu rút ${amount} USD đã được gửi đến admin.`,
      });
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div className="p-6 rounded-xl border bg-white shadow-sm">
        <h2 className="text-lg font-semibold mb-4">💸 Rút tiền</h2>
        <div className="flex items-center justify-between mb-4">
          <span>Số dư khả dụng:</span>
          <span className="font-bold text-green-600">${balance.toFixed(2)}</span>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button disabled={balance < 1}>Gửi yêu cầu rút tiền</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Gửi yêu cầu rút tiền</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Số tiền muốn rút</Label>
                <Input
                  type="number"
                  placeholder="Nhập số tiền"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
              </div>

              <div>
                <Label>Phương thức nhận tiền</Label>
                <Select onValueChange={setSelectedAccount} value={selectedAccount}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Chọn tài khoản" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ngân hàng ACB">Ngân hàng ACB</SelectItem>
                    <SelectItem value="Momo">Momo</SelectItem>
                    <SelectItem value="ZaloPay">ZaloPay</SelectItem>
                    <SelectItem value="PayPal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleRequest} disabled={isLoading}>
                {isLoading ? "Đang gửi..." : "Gửi yêu cầu cho admin"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="p-6 border rounded-xl bg-white shadow-sm">
        <h2 className="text-lg font-semibold mb-4">📜 Lịch sử yêu cầu rút tiền</h2>
        {history.length === 0 ? (
          <p className="text-muted-foreground text-sm">Chưa có yêu cầu nào.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {history.map((tx, i) => (
              <li key={i} className="flex justify-between items-center border-b py-2">
                <div>
                  <div>
                    {tx.date} - <strong>{tx.method}</strong>
                  </div>
                  <div className="text-xs text-muted-foreground">{tx.status}</div>
                </div>
                <span className="text-green-600 font-semibold">-${tx.amount}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
