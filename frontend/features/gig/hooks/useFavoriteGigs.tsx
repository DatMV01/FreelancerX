import useSWR from "swr";
import { useEffect } from "react";
import { fetchFavoritesGigs } from "@/features/gig/gig.api";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  setFavoriteGigs,
  setError,
  setLoading,
} from "@/lib/redux/features/gigs/gigsSlice2";
import { selectUser } from "@/lib/redux/features/auth/authSlice";

export const useFavoriteGigs = (): {
  data: any;
  error: any;
  isLoading: boolean;
  isValidating: boolean;
  isEmpty: boolean;
  mutate: () => void;
} => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const userId = user?.id;

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    userId ? "/gigs/favorites" : null,
    () => fetchFavoritesGigs(),
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
