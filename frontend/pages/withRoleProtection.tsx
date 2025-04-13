import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export function withRoleProtection(Component: any, allowedRoles: string[]) {
  return function ProtectedComponent(props: any) {
    const { data: session, status } = useSession();
    const [checking, setChecking] = useState(true);
    const router = useRouter();

    useEffect(() => {
      if (status === "loading") return;

      // if (status === "unauthenticated") {
      //   router.replace("/");
      //   return;
      // }

      const userRole = (session as any)?.user?.role?.name;

      if (!userRole || !allowedRoles.includes(userRole)) {
        router.replace("/auth/unauthorized");
        return;
      }

      setChecking(false);
    }, [status, session]);

    //    if (status === "loading" || checking) return null;

    if (status === "loading" || checking) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          <span className="ml-4 text-lg text-gray-700">Loading ...</span>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
