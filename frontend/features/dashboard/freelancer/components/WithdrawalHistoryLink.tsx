import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function WithdrawalHistoryLink() {
  return (
    <div className="mt-6 text-right">
      <Link href="/dashboard/withdrawals">
        <Button variant="outline" className="gap-2">
          View Withdrawal History <ArrowRight size={16} />
        </Button>
      </Link>
    </div>
  )
}
