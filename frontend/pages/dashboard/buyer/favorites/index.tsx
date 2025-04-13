"use client";

import useSWR from "swr";
import { ReactElement, useState } from "react";
import { cn } from "@/lib/utils";
import { Heart, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { fakekFavoriteGigs } from "@/lib/fakeFetcher";
import DashboardLayout from "@/components/layouts/DashboardLayout";

type Gig = {
  id: string;
  title: string;
  freelancer: string;
  price: number;
  rating: number;
  image: string;
};

export default function FavoriteGigs() {
  const {
    data: gigs,
    mutate,
    isLoading,
  } = useSWR("/api/favorites", fakekFavoriteGigs);
  const [unfavoriting, setUnfavoriting] = useState<string | null>(null);

  const handleUnfavorite = async (id: string) => {
    setUnfavoriting(id);
    try {
      const res = await fetch(`/api/favorites/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to remove favorite");
      await mutate();

      toast.info("Đã xóa khỏi yêu thích");
    } catch (error) {
      toast.info("Có lỗi xảy ra");
    } finally {
      setUnfavoriting(null);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <h1 className="text-xl font-semibold md:text-2xl">
        Your favorite gigs ❤️
      </h1>

      {isLoading ? (
        <p>Đang tải...</p>
      ) : gigs && gigs.length === 0 ? (
        <p className="text-muted-foreground">Bạn chưa có gig yêu thích nào.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gigs?.map((gig) => (
            <Card
              key={gig.id}
              className={cn(
                "group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
              )}
            >
              <img
                src={gig.image}
                alt={gig.title}
                className="h-40 w-full rounded-t-md object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <CardContent className="space-y-2 p-4">
                <div className="flex items-start justify-between">
                  <h2 className="line-clamp-2 text-base font-semibold">
                    {gig.title}
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={unfavoriting === gig.id}
                    onClick={() => handleUnfavorite(gig.id)}
                    className="transition-transform hover:scale-110"
                  >
                    <Heart
                      className={cn(
                        "h-5 w-5 transition-colors",
                        unfavoriting === gig.id
                          ? "text-gray-400"
                          : "fill-red-500 text-red-500",
                      )}
                    />
                  </Button>
                </div>
                <p className="text-muted-foreground text-sm">
                  by {gig.freelancer}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    {gig.rating}
                  </div>
                  <span className="text-primary font-semibold">
                    {gig.price.toLocaleString()}₫
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

FavoriteGigs.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
