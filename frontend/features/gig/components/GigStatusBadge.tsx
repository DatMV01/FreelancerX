import { cn } from "@/lib/utils";
import {
  PlayCircle,
  NotepadTextDashed,
  PauseCircle,
  Pencil,
  XCircle,
  Hourglass,
} from "lucide-react";
import { GigStatus } from "../gig.types";

const statusMap: Record<
  GigStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  ACTIVE: {
    label: "ACTIVE",
    color: "bg-green-100 text-green-800",
    icon: <PlayCircle className="text-green-500" />,
  },
  DRAFT: {
    label: "DRAFT",
    color: "bg-indigo-100 text-indigo-800",
    icon: <NotepadTextDashed className="text-indigo-500" />,
  },
  PAUSED: {
    label: "PAUSED",
    color: "bg-orange-100 text-orange-800",
    icon: <PauseCircle className="text-orange-500" />,
  },
  //   REQUIRE_MODIFICATION: {
  //     label: "REQUIRE MODIFICATION",
  //     color: "bg-yellow-100 text-yellow-800",
  //     icon: <Pencil className="text-yellow-500" />,
  //   },
  REJECTED: {
    label: "REJECTED",
    color: "bg-red-100 text-red-800",
    icon: <XCircle className="text-red-500" />,
  },
  //   PENDING_APPROVAL: {
  //     label: "PENDING APPROVAL",
  //     color: "bg-gray-100 text-gray-800",
  //     icon: <Hourglass className="text-gray-500" />,
  //   },
};

interface GigStatusBadgeProps {
  status: GigStatus;
  className?: string;
}

export const GigStatusBadge = ({ status, className }: GigStatusBadgeProps) => {
  const statusItem = statusMap[status];

  if (!statusItem) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
        statusItem.color,
        className,
      )}
    >
      {statusItem.icon}
      {statusItem.label}
    </span>
  );
};
