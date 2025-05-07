"use client";

import { useFavoriteGigs } from "@/features/gig/hooks/useFavoriteGigs";
import {
  selectUser,
  setAuthFromSession,
  syncNexthAuthSesion,
} from "@/lib/redux/features/auth/authSlice";
import { fetchFavoriteGigs } from "@/lib/redux/features/gigs/gigsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export function SyncSessionToRedux() {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("====================================");
    console.log("SyncSessionToRedux");
    console.log(session);
    console.log("====================================");

    session && dispatch(setAuthFromSession(session as any));
  }, [session, status]);

  // useEffect(() => {
  //   const interval = setInterval(
  //     async () => {
  //       const updated = await getSession();
  //       updated && dispatch(setAuthFromSession(updated as any));
  //     },
  //     5 * 60 * 1000,
  //   );

  //   return () => clearInterval(interval);
  // }, []);

  return null;
}

export function SyncSessionToRedux2() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetch = async () => {
      const session = await dispatch(syncNexthAuthSesion()).unwrap();

      console.log("====================================");
      console.log("SyncSessionToRedux2");
      console.log(session);
      console.log("====================================");
    };

    fetch();
  }, []);

  return null;
}

export function SyncFavoriteGigsToRedux() {
  useFavoriteGigs();

  return null;
}
