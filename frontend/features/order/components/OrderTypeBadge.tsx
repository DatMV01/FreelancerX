import { Badge } from "@/components/ui/badge";
import { Gem, Star, Crown } from "lucide-react";

export type OrderType = "BASIC" | "STANDARD" | "PREMIUM";

const typeMap: Record<
  OrderType,
  { label: string; color: string; icon: React.ReactNode }
> = {
  BASIC: {
    label: "BASIC",
    color: "bg-gray-100 text-gray-800",
    icon: <Gem className="mr-1 h-4 w-4 text-gray-500" />,
  },
  STANDARD: {
    label: "STANDARD",
    color: "bg-blue-100 text-blue-800",
    icon: <Star className="mr-1 h-4 w-4 text-blue-500" />,
  },
  PREMIUM: {
    label: "PREMIUM",
    color: "bg-yellow-100 text-yellow-800",
    icon: <Crown className="mr-1 h-4 w-4 text-yellow-500" />,
  },
};

export function OrderTypeBadge({ type }: { type: OrderType }) {
  const current = typeMap[type];

  return (
    <Badge className={`inline-flex items-center ${current.color}`}>
      {current.icon}
      {current.label}
    </Badge>
  );
}
