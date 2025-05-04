import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { getFirstTwoLetters } from "@/lib/utils";
import { format } from "date-fns";
import { Ban, CheckCircle, Clock, File, Hourglass, Undo2 } from "lucide-react";
import { JSX } from "react";

type OrderLog = {
  id: string;
  orderId: string;
  action: string;
  fromStatus: string | null;
  toStatus: string;
  userId: string;
  userRole: "BUYER" | "FREELANCER" | "ADMIN";
  message: string;
  createdAt: string;
};

type Props = {
  logs?: any[];
};

const orderLogs = [
  {
    id: "log-1",
    orderId: "order-123",
    action: "CREATE_ORDER",
    fromStatus: null,
    toStatus: "UNPAID",
    userId: "buyer-001",
    userRole: "BUYER",
    message: "Buyer created the order.",
    createdAt: "2025-04-19T10:00:00Z",
  },
  {
    id: "log-2",
    orderId: "order-123",
    action: "PAY_ORDER",
    fromStatus: "UNPAID",
    toStatus: "PENDING",
    userId: "buyer-001",
    userRole: "BUYER",
    message: "Buyer paid the order. Waiting for freelancer to accept.",
    createdAt: "2025-04-19T10:05:00Z",
  },
  {
    id: "log-3",
    orderId: "order-123",
    action: "ACCEPT_ORDER",
    fromStatus: "PENDING",
    toStatus: "ACCEPTED",
    userId: "freelancer-001",
    userRole: "FREELANCER",
    message: "Freelancer accepted the order.",
    createdAt: "2025-04-19T10:15:00Z",
  },
  {
    id: "log-4",
    orderId: "order-123",
    action: "START_WORK",
    fromStatus: "ACCEPTED",
    toStatus: "IN_PROGRESS",
    userId: "freelancer-001",
    userRole: "FREELANCER",
    message: "Freelancer started working on the order.",
    createdAt: "2025-04-19T10:30:00Z",
  },
  {
    id: "log-5",
    orderId: "order-123",
    action: "DELIVER_WORK",
    fromStatus: "IN_PROGRESS",
    toStatus: "DELIVERED",
    userId: "freelancer-001",
    userRole: "FREELANCER",
    message: "Freelancer delivered the work.",
    createdAt: "2025-04-19T12:00:00Z",
  },
  {
    id: "log-6",
    orderId: "order-123",
    action: "REQUEST_REVISION",
    fromStatus: "DELIVERED",
    toStatus: "REVISION_REQUESTED",
    userId: "buyer-001",
    userRole: "BUYER",
    message: "Buyer requested a revision.",
    createdAt: "2025-04-19T13:00:00Z",
  },
  {
    id: "log-7",
    orderId: "order-123",
    action: "RE_DELIVER_WORK",
    fromStatus: "REVISION_REQUESTED",
    toStatus: "DELIVERED",
    userId: "freelancer-001",
    userRole: "FREELANCER",
    message: "Freelancer re-delivered the work.",
    createdAt: "2025-04-19T15:00:00Z",
  },
  {
    id: "log-8",
    orderId: "order-123",
    action: "COMPLETE_ORDER",
    fromStatus: "DELIVERED",
    toStatus: "COMPLETED",
    userId: "buyer-001",
    userRole: "BUYER",
    message: "Buyer marked the order as completed.",
    createdAt: "2025-04-19T18:00:00Z",
  },
  {
    id: "log-9",
    orderId: "order-124",
    action: "CANCEL_ORDER",
    fromStatus: "PENDING",
    toStatus: "CANCEL",
    userId: "buyer-002",
    userRole: "BUYER",
    message: "Buyer canceled the order.",
    createdAt: "2025-04-19T11:00:00Z",
  },
] as any;

const iconMap: Record<string, JSX.Element> = {
  CREATE_ORDER: <File className="text-muted-foreground h-4 w-4" />,
  PAY_ORDER: <CheckCircle className="h-4 w-4 text-green-500" />,
  ACCEPT_ORDER: <CheckCircle className="h-4 w-4 text-green-600" />,
  START_WORK: <Hourglass className="h-4 w-4 text-blue-500" />,
  DELIVER_WORK: <CheckCircle className="h-4 w-4 text-indigo-500" />,
  RE_DELIVER_WORK: <CheckCircle className="h-4 w-4 text-indigo-600" />,
  REQUEST_REVISION: <Undo2 className="h-4 w-4 text-yellow-500" />,
  COMPLETE_ORDER: <CheckCircle className="h-4 w-4 text-emerald-600" />,
  CANCEL_ORDER: <Ban className="h-4 w-4 text-red-500" />,
  CANCEL_ORDER_BUYER: <Ban className="h-4 w-4 text-red-500" />,
  CANCEL_ORDER_FREELANCER: <Ban className="h-4 w-4 text-red-500" />,
};

export const OrderLogTimeline = ({ logs = orderLogs }: Props) => {
  const sortedLogs = [...logs].sort(
    (a: any, b: any) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="flex h-full flex-col gap-y-2">
      <p className="text-center text-lg font-semibold">Timeline</p>

      <div className="flex h-full flex-col gap-y-4 overflow-y-auto">
        {sortedLogs.map((log, idx) => (
          <div key={log.id}>
            <div className="flex items-center gap-x-4">
              <div className="rounded-full border bg-white p-1 shadow-sm">
                {iconMap[log.action] || (
                  <Clock className="h-4 w-4 text-gray-400" />
                )}
              </div>

              <div className="w-full text-sm">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={log?.actor?.avatar} />

                    <AvatarFallback>
                      {getFirstTwoLetters(log?.actorType)}{" "}
                    </AvatarFallback>
                  </Avatar>

                  <span className="font-medium">{log.actorType}</span>

                  <span className="text-muted-foreground text-xs">
                    {format(new Date(log.createdAt), "HH:mm dd/MM/yyyy")}
                  </span>
                </div>
                <p className="text-muted-foreground">{log.message}</p>
              </div>
            </div>

            <Separator />
          </div>
        ))}
      </div>
    </div>
  );
};
