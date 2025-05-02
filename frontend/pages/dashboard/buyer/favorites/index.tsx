"use client";

import CircularProgressCenter from "@/components/CircularProgressCenter";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import DashboardLayout2 from "@/components/layouts/DashboardLayout2";
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
    <div className="flex flex-col space-y-6">
      <h1 className="rounded-md border border-green-500 p-4 text-center text-2xl font-bold text-green-500">
        Fovorites
      </h1>
      <GigLitstingSection data={favoriteGigs} />
    </div>
  );
}

FavoriteGigs.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout2>{page}</DashboardLayout2>;
};
