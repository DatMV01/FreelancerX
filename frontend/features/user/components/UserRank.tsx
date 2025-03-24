"use client";

import { SellerRankStatus } from "@/features/seller/seller.rank.enum";
import { Diamond } from "lucide-react";
import React from "react";

const rankData = [
  {
    level: SellerRankStatus.new,
    label: "New Seller",
    bgColor: "oklch(0.905 0.182 98.111)",
    diamonds: [
      "oklch(0.707 0.022 261.325)",
      "oklch(0.707 0.022 261.325)",
      "oklch(0.707 0.022 261.325)",
    ],
  },
  {
    level: SellerRankStatus.level1,
    label: "Level 1",
    bgColor: "oklch(0.905 0.182 98.111)",
    diamonds: [
      "black",
      "oklch(0.707 0.022 261.325)",
      "oklch(0.707 0.022 261.325)",
    ],
  },
  {
    level: SellerRankStatus.level2,
    label: "Level 2",
    bgColor: "rgb(252 211 77)",
    diamonds: ["black", "black", "oklch(0.707 0.022 261.325)"],
  },
  {
    level: SellerRankStatus.level3,
    label: "Top Rated",
    bgColor: "rgb(252 211 77)",
    diamonds: ["black", "black", "black"],
  },
];

const UserRank = ({ rankLevel }: { rankLevel: string }) => {
  const rank = rankData.find((r) => r.level === rankLevel);
  if (!rank) return null;

  return (
    <div className="flex w-fit items-center space-x-2">
      <p
        style={{ backgroundColor: rank.bgColor }}
        className="flex h-[20px] w-fit shrink-0 grow-0 items-center rounded-sm px-2 text-xs font-bold"
      >
        <span>{rank.label}</span>
        {rank.diamonds.map((color, i) => (
          <Diamond key={i} size={10} fill={color} stroke="none" />
        ))}
      </p>
    </div>
  );
};

export default UserRank;
