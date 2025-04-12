import { motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  Hourglass,
  Loader2,
  XCircle,
  PauseCircle,
  AlertCircle,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const statusMap = {
  created: {
    label: "Tạo đơn",
    color: "gray",
    icon: Clock,
    description: "Đơn hàng được tạo và chờ xác nhận.",
  },
  accepted: {
    label: "Đã nhận đơn",
    color: "blue",
    icon: Hourglass,
    description: "Freelancer đã nhận đơn và chuẩn bị làm việc.",
  },
  in_progress: {
    label: "Đang làm",
    color: "yellow",
    icon: Loader2,
    description: "Công việc đang được thực hiện.",
  },
  paused: {
    label: "Tạm dừng",
    color: "orange",
    icon: PauseCircle,
    description: "Tạm dừng tiến độ.",
  },
  failed: {
    label: "Thất bại",
    color: "red",
    icon: XCircle,
    description: "Đơn hàng thất bại.",
  },
  completed: {
    label: "Hoàn thành",
    color: "green",
    icon: CheckCircle,
    description: "Công việc đã hoàn tất thành công.",
  },
};

export function OrderStatusTimeline({
  history,
}: {
  history: { status: keyof typeof statusMap; time: string }[];
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
      }}
      className="space-y-4 border-l-2 pl-4"
    >
      {history.map((item, index) => {
        const { label, color, icon: Icon, description } = statusMap[item.status] || {
          label: item.status,
          color: "gray",
          icon: AlertCircle,
          description: "Không rõ trạng thái.",
        };

        return (
          <motion.div
            key={index}
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            className="relative"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "absolute -left-[26px] top-1 rounded-full border-2 w-5 h-5 flex items-center justify-center",
                    {
                      "border-green-500 bg-green-100 text-green-600": color === "green",
                      "border-gray-400 bg-gray-100 text-gray-600": color === "gray",
                      "border-blue-500 bg-blue-100 text-blue-600": color === "blue",
                      "border-yellow-500 bg-yellow-100 text-yellow-600": color === "yellow",
                      "border-red-500 bg-red-100 text-red-600": color === "red",
                      "border-orange-500 bg-orange-100 text-orange-600": color === "orange",
                    }
                  )}
                >
                  <Icon size={12} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">{description}</p>
              </TooltipContent>
            </Tooltip>

            <div className="ml-2">
              <div className="font-medium">{label}</div>
              <div className="text-sm text-muted-foreground">{item.time}</div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
