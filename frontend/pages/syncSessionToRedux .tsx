"use client";

import { setAuthFromSession } from "@/lib/redux/features/auth/authSlice";
import { useAppDispatch } from "@/lib/redux/hooks";
import { getSession, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function SyncSessionToRedux() {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log(session);

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
