import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

const useGetUserInfo = () => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<Session["user"] | null>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setAuthenticated(true);
      setUser(session.user);
    } else {
      setAuthenticated(false);
      setUser(null);
    }
  }, [status, session]);
  
  console.log("Session Data:", session);

  return { isAuthenticated, user, session };
};

export default useGetUserInfo;
