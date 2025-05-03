import useSWR from "swr";
import { useEffect } from "react";
import { fetchFavoritesGigs } from "@/features/gig/gig.api";
import { useAppDispatch } from "@/lib/redux/hooks";
import {
  setFavoriteGigs,
  setError,
  setLoading,
} from "@/lib/redux/features/gigs/gigsSlice2";

export const useFavoriteGigs = (): {
  data: any;
  error: any;
  isLoading: boolean;
  isValidating: boolean;
  isEmpty: boolean;
  mutate: () => void;
} => {
  const dispatch = useAppDispatch();

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    "/gigs/favorites",
    fetchFavoritesGigs,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
      dedupingInterval: 0,
    },
  );

  useEffect(() => {
    if (data) {
      dispatch(setFavoriteGigs(data));
    }

    if (error) {
      dispatch(setError(error.message));
    }

    dispatch(setLoading(isValidating));
  }, [data, error, isValidating, dispatch]);

  return {
    data,
    error,
    isLoading,
    isValidating,
    isEmpty: !isLoading && !error && data?.length === 0,
    mutate,
  };
};
