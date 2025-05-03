"use client";

import CircularProgressCenter from "@/components/CircularProgressCenter";
import { ErrorOrEmptyState } from "@/components/ErrorOrEmptyState";
import DashboardLayout2 from "@/components/layouts/DashboardLayout2";
import { Button } from "@/components/ui/button";
import GigLitstingSection from "@/features/categories/GigLitstingSection";
import {
  DashboardMainContent,
  DashboardMainContentHeader,
} from "@/features/dashboard/components/DashboardMainContent";
import { useFavoriteGigs } from "@/features/gig/hooks/useFavoriteGigs";
import { selectFavoriteGigs } from "@/lib/redux/features/gigs/gigsSlice2";
import { useAppSelector } from "@/lib/redux/hooks";
import { RefreshCcw } from "lucide-react";
import { ReactElement } from "react";

export default function FavoriteGigs() {
  const { error, isLoading, isEmpty, isValidating, mutate } = useFavoriteGigs();

  const favoriteGigs = useAppSelector(selectFavoriteGigs);

  if (isLoading || isValidating) {
    return <CircularProgressCenter />;
  }

  return (
    <DashboardMainContent>
      <DashboardMainContentHeader>
        <p>Manage Fovorites</p>
        <Button
          variant="outline"
          onClick={() => {
            mutate();
          }}
        >
          <RefreshCcw />
        </Button>
      </DashboardMainContentHeader>

      <ErrorOrEmptyState
        isError={!!error}
        isLoading={isLoading || isValidating}
        isEmpty={isEmpty}
        retry={() => mutate()}
      />

      {favoriteGigs && <GigLitstingSection data={favoriteGigs} />}
    </DashboardMainContent>
  );
}

FavoriteGigs.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout2>{page}</DashboardLayout2>;
};
