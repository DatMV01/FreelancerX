import { setAuthFromSession } from "@/lib/redux/features/auth/authSlice";
import { useAppDispatch } from "@/lib/redux/hooks";
import { getSession, useSession } from "next-auth/react";
import { useEffect } from "react";

// ✅ NextAuth refresh accesstoken automatically
export default function AuthSync() {
  const { data: session, update } = useSession();

  const dispatch = useAppDispatch();

  useEffect(() => {
    const refreshAccess = () => {
      if (!session?.expires) return;
      const timeUntilRefresh = session.expires - Date.now() - 60 * 60 * 1000;

      if (timeUntilRefresh > 0) {
        const timer = setTimeout(() => {
          update();
        }, timeUntilRefresh);

        return () => clearTimeout(timer);
      }
    };

    if (session) {
      dispatch(setAuthFromSession(session as any));
    }

    //  refreshAccess();
  }, [session, dispatch]);

  return null;
}
