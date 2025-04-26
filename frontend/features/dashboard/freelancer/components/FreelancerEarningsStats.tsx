'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table'
import { saveAs } from 'file-saver'
import { Banknote, Calendar, Hourglass, Wallet } from 'lucide-react'
import { useState } from 'react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { toast } from 'sonner'
import useSWR from 'swr'



const fetcher = (url: string) => fetch(url).then(res => res.json())

function useWithdraw() {
  const [isLoading, setIsLoading] = useState(false)

  const withdraw = async ({ amount, method }: { amount: number; method: string }) => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/freelancer/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, method }),
      })
      if (!res.ok) throw new Error('Giao dịch thất bại')
      toast.success('Yêu cầu rút tiền đã được gửi')
    } catch (err: any) {
      toast.error(err.message || 'Có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  return { withdraw, isLoading }
}

const summaryData = [
  { title: 'Tổng thu nhập', value: '45,000,000₫', icon: <Wallet className="w-5 h-5" /> },
  { title: 'Đã rút', value: '30,000,000₫', icon: <Banknote className="w-5 h-5" /> },
  { title: 'Số dư hiện tại', value: '12,000,000₫', icon: <Calendar className="w-5 h-5" /> },
  { title: 'Đơn đang xử lý', value: '3,000,000₫', icon: <Hourglass className="w-5 h-5" /> },
]

const earningsByMonth = [
  { month: 'Th1', earnings: 3000000 },
  { month: 'Th2', earnings: 5000000 },
  { month: 'Th3', earnings: 8000000 },
  { month: 'Th4', earnings: 10000000 },
  { month: 'Th5', earnings: 6000000 },
  { month: 'Th6', earnings: 7000000 },
  { month: 'Th7', earnings: 2000000 },
  { month: 'Th8', earnings: 0 },
  { month: 'Th9', earnings: 0 },
  { month: 'Th10', earnings: 0 },
  { month: 'Th11', earnings: 0 },
  { month: 'Th12', earnings: 0 },
]

export default function FreelancerEarningsStats() {
  const [year, setYear] = useState('2025')
 
  const { data, isLoading } = useSWR(`/api/freelancer/earnings?year=${year}`, fetcher)
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('')
  const { withdraw, isLoading: withdrawing } = useWithdraw()

  const summary = data?.summary || {}
  const chartData = data?.monthly || []
  const transactions = data?.transactions || []
  const withdrawals = data?.withdrawals || []

  const exportCSV = () => {
    const csv = [
      ['Ngày', 'Gig', 'Buyer', 'Trạng thái', 'Số tiền'],
      ...transactions.map(tx => [tx.date, tx.gig, tx.buyer, tx.status, tx.amount]),
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, `thu-nhap-${year}.csv`)
  }

  const handleWithdraw = () => {
    const value = parseInt(amount)
    if (!value || !method) return toast.error('Vui lòng nhập số tiền và chọn phương thức')
    withdraw({ amount: value, method })
  }

  return (
    <div className="space-y-6">
      {/* Section 1: Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryData.map((item, index) => (
          <Card key={index} className="flex items-center justify-between p-4 shadow-sm rounded-2xl">
            <div>
              <p className="text-sm text-muted-foreground">{item.title}</p>
              <h3 className="text-lg font-semibold">{item.value}</h3>
            </div>
            <div className="text-primary bg-muted p-2 rounded-full">
              {item.icon}
            </div>
          </Card>
        ))}
      </div>

      {/* Section 2: Earnings chart */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Thu nhập theo tháng</h2>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Chọn năm" />
            </SelectTrigger>
            <SelectContent>
              {['2025', '2024', '2023'].map(y => (
                <SelectItem key={y} value={y}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={earningsByMonth}>
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => `${value / 1000000}tr`} />
            <Tooltip formatter={(value: number) => `${value.toLocaleString()}₫`} />
            <Bar dataKey="earnings" fill="#4f46e5" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="space-y-6">
      {/* Tổng quan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex flex-col gap-1">
          <span className="text-muted-foreground text-sm">Tổng thu nhập</span>
          <span className="text-xl font-semibold flex items-center gap-2"><Wallet className="w-5 h-5" /> {summary.totalIncome?.toLocaleString()}₫</span>
        </Card>
        <Card className="p-4 flex flex-col gap-1">
          <span className="text-muted-foreground text-sm">Đã rút</span>
          <span className="text-xl font-semibold flex items-center gap-2"><Banknote className="w-5 h-5" /> {summary.totalWithdrawn?.toLocaleString()}₫</span>
        </Card>
        <Card className="p-4 flex flex-col gap-1">
          <span className="text-muted-foreground text-sm">Đơn đang xử lý</span>
          <span className="text-xl font-semibold flex items-center gap-2"><Hourglass className="w-5 h-5" /> {summary.pendingAmount?.toLocaleString()}₫</span>
        </Card>
        <Card className="p-4 flex flex-col gap-1">
          <span className="text-muted-foreground text-sm">Số dư khả dụng</span>
          <span className="text-xl font-semibold">{summary.available?.toLocaleString()}₫</span>
        </Card>
      </div>

      {/* Biểu đồ */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Thu nhập theo tháng</h2>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Chọn năm" />
            </SelectTrigger>
            <SelectContent>
              {['2025', '2024', '2023'].map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(v) => `${v / 1_000_000}tr`} />
            <Tooltip formatter={(value: number) => `${value.toLocaleString()}₫`} />
            <Bar dataKey="total" fill="#4f46e5" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Giao dịch chi tiết */}
      <Card className="p-4 overflow-x-auto">
        <div className="flex justify-between mb-4 flex-wrap gap-2">
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
      <Card className="p-4 space-y-4">
        <h3 className="text-lg font-semibold">Rút tiền</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Nhập số tiền muốn rút (₫)" />
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn tài khoản nhận" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="momo">Momo - 098xxxxxxx</SelectItem>
              <SelectItem value="vcb">Vietcombank - 1234</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleWithdraw} disabled={withdrawing} className="mt-2">
          {withdrawing ? 'Đang xử lý...' : 'Xác nhận rút tiền'}
        </Button>
      </Card>

      {/* Lịch sử rút tiền */}
      <Card className="p-4 overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4">Lịch sử rút tiền</h3>
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
    </div>
  )
}
