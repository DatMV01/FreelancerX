import { Session, User } from "next-auth";
import { useSession } from "next-auth/react";

const useGetUserInfo = (): {
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;
} => {
  const { data: session, status } = useSession() as {
    data: Session | null;
    status: string;
  };

  const info = {
    isAuthenticated: status === "authenticated",
    user: session?.user || null,
    session,
  } as any ;

  console.log(info);

  return info;
};

export default useGetUserInfo;
