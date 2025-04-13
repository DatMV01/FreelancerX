import { useSession } from "next-auth/react";

import {
  selectSession,
  setAuthFromSession,
} from "@/lib/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useEffect } from "react";

export function useSmartSession() {
  const dispatch = useAppDispatch();
  const reduxSession = useAppSelector(selectSession);

  const { data: authSession, status: authStatus } = useSession({
    required: false, // không redirect nếu chưa đăng nhập
  });

  useEffect(() => {
    if (authStatus === "authenticated" && !reduxSession) {
      session && dispatch(setAuthFromSession(session as any));
    }
  }, [authStatus, authSession]);

  const session = reduxSession ? reduxSession : authSession;

  const status = (reduxSession as any)?.status || authStatus;

  return { session, status };
}
