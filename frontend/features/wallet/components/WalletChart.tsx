"use client";

import CircularProgressCenter from "@/components/CircularProgressCenter";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { saveAs } from "file-saver";
import { RefreshCcw } from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import * as XLSX from "xlsx";

const dataByYear = {
  "2024": [
    { month: "Jan", totalEarnings: 3200, totalWithdrawals: 1500, refund: 200 },
    { month: "Feb", totalEarnings: 2900, totalWithdrawals: 1400, refund: 100 },
    { month: "Mar", totalEarnings: 3400, totalWithdrawals: 1600, refund: 150 },
    { month: "Apr", totalEarnings: 3100, totalWithdrawals: 1700, refund: 50 },
    { month: "May", totalEarnings: 3600, totalWithdrawals: 1800, refund: 250 },
    { month: "Jun", totalEarnings: 4000, totalWithdrawals: 2000, refund: 300 },
    { month: "Jul", totalEarnings: 4200, totalWithdrawals: 1900, refund: 180 },
    { month: "Aug", totalEarnings: 3900, totalWithdrawals: 1700, refund: 100 },
    { month: "Sep", totalEarnings: 3700, totalWithdrawals: 1600, refund: 90 },
    { month: "Oct", totalEarnings: 4100, totalWithdrawals: 2000, refund: 130 },
    { month: "Nov", totalEarnings: 4300, totalWithdrawals: 2100, refund: 110 },
    { month: "Dec", totalEarnings: 4500, totalWithdrawals: 2200, refund: 300 },
  ],
};

interface TransactionSummary {
  month: string;
  totalEarnings: number;
  totalWithdrawals: number;
  totalRefunds: number;
}

interface ChartEarningsProps {
  dataByYear: {
    [year: string]: TransactionSummary[];
  };
  isLoading: boolean;
  setYearCb: (year: string) => void;
  mutate: any;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    const earnings =
      payload.find((item) => item.dataKey === "totalEarnings")?.value || 0;
    const withdrawals =
      payload.find((item) => item.dataKey === "totalWithdrawals")?.value || 0;
    const refund =
      payload.find((item) => item.dataKey === "totalRefunds")?.value || 0;

    return (
      <div className="rounded bg-white p-3 text-sm shadow-md">
        <p className="font-bold">{label}</p>
        <p className="text-green-600">Earnings: ${earnings.toLocaleString()}</p>
        <p className="text-red-500">
          Withdrawals: ${withdrawals.toLocaleString()}
        </p>
        <p className="text-blue-500">Refund: ${refund.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export function WalletChart({
  dataByYear,
  isLoading,
  setYearCb,
  mutate,
}: ChartEarningsProps) {
  if (!dataByYear) {
    return null;
  }

  const [year, setYear] = useState<string>(Object.keys(dataByYear)[0]);
  const data = dataByYear[year] || [];

  const handleExportExcel = () => {
    const workbook = XLSX.utils.book_new();

    Object.entries(dataByYear).forEach(([year, transactions]) => {
      const formattedData = transactions.map((item) => ({
        Month: item.month,
        "Total Earnings": item.totalEarnings,
        "Total Withdrawals": item.totalWithdrawals,
        "Total Refunds": item.totalRefunds,
      }));

      const worksheet = XLSX.utils.json_to_sheet(formattedData);

      const lastRow = transactions.length + 2;
      worksheet[`A${lastRow}`] = { t: "s", v: "Total:" };
      worksheet[`B${lastRow}`] = { t: "n", f: `SUM(B2:B${lastRow - 1})` };
      worksheet[`C${lastRow}`] = { t: "n", f: `SUM(C2:C${lastRow - 1})` };
      worksheet[`D${lastRow}`] = { t: "n", f: `SUM(D2:D${lastRow - 1})` };

      const range = XLSX.utils.decode_range(worksheet["!ref"]!);
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_cell({ c: C, r: 0 });
        if (!worksheet[address]) continue;
        worksheet[address].s = {
          font: { bold: true },
          fill: { fgColor: { rgb: "DCE6F1" } },
          alignment: { horizontal: "center" },
        };
      }

      worksheet["!cols"] = [{ wch: 15 }, { wch: 20 }, { wch: 20 }, { wch: 20 }];

      worksheet["!rows"] = [{ hpt: 20 }];

      XLSX.utils.book_append_sheet(workbook, worksheet, `Earnings_${year}`);
    });

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
      cellStyles: true,
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `earnings_all_years.xlsx`);
  };

  return (
    <div className="flex h-[400px] flex-col">
      {/* Header */}
      <div className="flex h-14 items-center justify-between">
        <div className="flex items-center gap-x-2">
          <p className="text-xl font-bold">Earnings Chart</p>
          <Button
            variant="outline"
            onClick={() => {
              mutate();
            }}
          >
            <RefreshCcw />
          </Button>
        </div>

        {!isLoading && (
          <div className="flex gap-2">
            <Select
              value={year}
              onValueChange={(newYear) => {
                setYear(newYear);
                setYearCb(newYear);
              }}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(dataByYear).map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" variant="outline" onClick={handleExportExcel}>
              Export Excel
            </Button>
          </div>
        )}
      </div>
      {isLoading && <CircularProgressCenter />}

      {!isLoading && (
        <div className="h-[350px] w-full rounded-lg bg-white p-4 shadow">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={(props) => <CustomTooltip {...props} />} />
              <Legend />
              <Bar
                dataKey="totalEarnings"
                fill="#4ade80"
                name="Earnings"
                animationDuration={800}
              />
              <Bar
                dataKey="totalWithdrawals"
                fill="#f87171"
                name="Withdrawals"
                animationDuration={800}
              />
              <Bar
                dataKey="totalRefunds"
                fill="#60a5fa"
                name="Refund"
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
