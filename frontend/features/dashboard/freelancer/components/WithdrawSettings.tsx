"use client"

import { useState } from "react"
import { toast } from "sonner"
import axios from "axios"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const withdrawOptions = [
  { label: "Bank Transfer", value: "bank" },
  { label: "Momo Wallet", value: "momo" },
  { label: "PayPal", value: "paypal" },
]

export default function WithdrawSettings() {
  const [selected, setSelected] = useState("bank")
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    try {
      setLoading(true)
      await axios.post("/api/account/withdraw-settings", { method: selected })
      toast.success("Default withdrawal method saved.")
    } catch {
      toast.error("Failed to save withdrawal method.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Withdrawal Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup value={selected} onValueChange={setSelected}>
          {withdrawOptions.map((opt) => (
            <div key={opt.value} className="flex items-center space-x-2">
              <RadioGroupItem value={opt.value} id={opt.value} />
              <Label htmlFor={opt.value}>{opt.label}</Label>
            </div>
          ))}
        </RadioGroup>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save Method"}
        </Button>
      </CardContent>
    </Card>
  )
}
