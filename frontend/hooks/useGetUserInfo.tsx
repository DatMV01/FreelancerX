import { useSession } from "next-auth/react";

const useGetUserInfo = () => {
  const { data: session, status } = useSession();

  const info = {
    isAuthenticated: status === "authenticated",
    user: session?.user || null,
    session,
  };

  console.log(info);

  return info;
};

export default useGetUserInfo;
