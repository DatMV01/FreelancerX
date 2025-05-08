"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GigStatus } from "@/features/gig/gig.types";

import { cn } from "@/lib/utils";
import {
  Ban,
  NotepadTextDashed,
  PauseCircle,
  PlayCircle
} from "lucide-react";

export default function GigsStats({
  gigs,
  requiredStatus,
}: {
  gigs: any;
  requiredStatus?: string[];
}) {
  if (!gigs) return null;

  const stats = [
    {
      key: GigStatus.ACTIVE,
      title: "ACTIVE",
      value: gigs.filter((o: any) => o.status === GigStatus.ACTIVE).length,
      icon: PlayCircle,
      color: "text-emerald-600",
    },
    {
      key: GigStatus.DRAFT,
      title: "DRAFT",
      value: gigs.filter((o: any) => o.status === GigStatus.DRAFT).length,
      icon: NotepadTextDashed,
      color: "text-emerald-600",
    },
    {
      key: GigStatus.PAUSED,
      title: "PAUSED",
      value: gigs.filter((o: any) => o.status === GigStatus.PAUSED).length,
      icon: PauseCircle,
      color: "text-orange-500",
    },
    // {
    //   key: GigStatus.PENDING_APPROVAL,
    //   title: "PENDING APPROVAL",
    //   value: gigs.filter((o: any) => o.status === GigStatus.PENDING_APPROVAL)
    //     .length,
    //   icon: Hourglass,
    //   color: "text-yellow-500",
    // },
    // {
    //   key: GigStatus.REQUIRE_MODIFICATION,
    //   title: "REQUIRE MODIFICATION",
    //   value: gigs.filter(
    //     (o: any) => o.status === GigStatus.REQUIRE_MODIFICATION,
    //   ).length,
    //   icon: Pencil,
    //   color: "text-green-600",
    // },
    // {
    //   key: GigStatus.DELETED,
    //   title: "DELETED",
    //   value: gigs.filter((o: any) => o.status === GigStatus.DELETED).length,
    //   icon: X,
    //   color: "text-red-500",
    // },
    {
      key: GigStatus.REJECTED,
      title: "REJECTED",
      value: gigs.filter((o: any) => o.status === GigStatus.REJECTED).length,
      icon: Ban,
      color: "text-red-600",
    },
    // {
    //   key: "TOTAL_GIGS",
    //   title: "TOTAL GIGS",
    //   value: gigs.length,
    //   icon: FileText,
    //   color: "text-blue-600",
    // },
  ];

  const filteredStats = requiredStatus
    ? stats.filter((s) => requiredStatus.includes(s.key))
    : stats;

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-8">
      {filteredStats.map((stat) => (
        <Card key={stat.key} className="h-full gap-0">
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={cn("h-5 w-5", stat.color)} />
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
