"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

type RoleGuardProps = {
  allowedRoles: string[];
  children: ReactNode;
};

export default function RoleGuardV1({
  allowedRoles,
  children,
}: RoleGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  const userRole = (session as any)?.user?.role;

  useEffect(() => {
    if (status === "loading") return;

    //     if (status === "unauthenticated") {
    //       router.replace("/");
    //       return;
    //     }

    if (!userRole || !allowedRoles.includes(userRole)) {
      router.replace("/unauthorized");
      return;
    }

    setChecking(false);
  }, [status, userRole]);

  if (status === "loading" || checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <span className="ml-4 text-lg text-gray-700">
          You are checking permissions.
        </span>
      </div>
    );
  }

  return <>{children}</>;
}
