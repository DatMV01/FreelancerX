"use client";

import CircularProgressCenter from "@/components/CircularProgressCenter";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import GigLitstingSection from "@/features/categories/GigLitstingSection";
import {
  fetchFavoriteGigs,
  selectFavoriteGigs,
  selectFavoriteGigsStatus,
} from "@/lib/redux/features/gigs/gigsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { ReactElement, useEffect } from "react";

export default function FavoriteGigs() {
  const dispatch = useAppDispatch();

  const favoriteGigsStatus = useAppSelector(selectFavoriteGigsStatus);
  const favoriteGigs = useAppSelector(selectFavoriteGigs);

  useEffect(() => {
    const fetch = async () => {
      await dispatch(fetchFavoriteGigs()).unwrap();
    };

    fetch();
  }, []);

  if (favoriteGigsStatus === "loading") return <CircularProgressCenter />;

  return (
    <div>
      <div className="text-2xl font-bold">Fovorites Gigs</div>
      <GigLitstingSection data={favoriteGigs} />
    </div>
  );
}

FavoriteGigs.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
