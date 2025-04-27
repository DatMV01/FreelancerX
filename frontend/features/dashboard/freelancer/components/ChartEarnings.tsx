"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { saveAs } from "file-saver";
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

interface TransactionSummary {
  month: string;
  totalEarnings: number;
  totalWithdrawals: number;
}

interface ChartEarningsProps {
  dataByYear: {
    [year: string]: TransactionSummary[];
  };
}
const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active: any;
  payload: any;
  label: any;
}) => {
  if (active && payload && payload.length) {
    const earnings =
      payload.find((item: any) => item.dataKey === "earnings")?.value || 0;
    const withdrawals =
      payload.find((item: any) => item.dataKey === "withdrawals")?.value || 0;

    return (
      <div className="rounded bg-white p-3 text-sm shadow-md">
        <p className="font-bold">{label}</p>
        <p className="text-green-600">Earnings: ${earnings.toLocaleString()}</p>
        <p className="text-red-500">
          Withdrawals: ${withdrawals.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};
export function ChartEarnings({ dataByYear }: ChartEarningsProps) {
  const [year, setYear] = useState<string>(Object.keys(dataByYear)[0]);

  const data = dataByYear[year] || [];

  const handleExportExcel = () => {
    const workbook = XLSX.utils.book_new();

    Object.entries(dataByYear).forEach(([year, transactions]) => {
      // Format dữ liệu cho sheet
      const formattedData = transactions.map((item) => ({
        Month: item.month,
        "Total Earnings": item.totalEarnings,
        "Total Withdrawals": item.totalWithdrawals,
      }));

      const worksheet = XLSX.utils.json_to_sheet(formattedData);

      // Thêm dòng SUM ở cuối
      const lastRow = transactions.length + 2; // +2 vì bắt đầu từ 1 và còn header
      worksheet[`A${lastRow}`] = { t: "s", v: "Total:" };
      worksheet[`B${lastRow}`] = { t: "n", f: `SUM(B2:B${lastRow - 1})` };
      worksheet[`C${lastRow}`] = { t: "n", f: `SUM(C2:C${lastRow - 1})` };

      // Format ô (ví dụ tô màu header)
      const range = XLSX.utils.decode_range(worksheet["!ref"]!);
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_cell({ c: C, r: 0 });
        if (!worksheet[address]) continue;
        worksheet[address].s = {
          font: { bold: true },
          fill: { fgColor: { rgb: "DCE6F1" } }, // nền xanh nhạt
          alignment: { horizontal: "center" },
        };
      }

      worksheet["!cols"] = [
        { wch: 15 }, // Month
        { wch: 20 }, // Earnings
        { wch: 20 }, // Withdrawals
      ];

      worksheet["!rows"] = [{ hpt: 20 }]; // chiều cao dòng header

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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Earnings Summary</h2>
        <div className="flex gap-2">
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-[120px]">
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
      </div>

      {/* Chart */}
      <div className="h-[320px] w-full rounded-lg bg-white p-4 shadow">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value: number, name: string) => [
                `$${value.toFixed(2)}`,
                {
                  totalEarnings: "Earnings",
                  totalWithdrawals: "Withdrawals",
                }[name as "totalEarnings" | "totalWithdrawals"] || name,
              ]}
            />
            {/* <Tooltip
              formatter={(value: number, name: string) => {
                let label = "";
                if (name === "totalEarnings") label = "Earnings";
                else if (name === "totalWithdrawals") label = "Withdrawals";
                else label = name; // fallback, hoặc bạn custom thêm
                return [`$${value.toFixed(2)}`, label];
              }}
            /> */}
            {/* <Tooltip content={<CustomTooltip />} /> */}

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
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
