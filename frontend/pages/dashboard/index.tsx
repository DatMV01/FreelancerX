"use client";

import { CircularProgress } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashBoard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    // return (
    //   <div className="flex h-screen items-center justify-center">
    //     <CircularProgress />
    //   </div>
    // );
    return null;
  }

  if (!session) return null;

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {session.user?.email}!</p>
      <p>firstName, {session.user?.firstName}!</p>
      <p>lastName, {session.user?.lastName}!</p>
      <p>role, {session.user?.role}!</p>
      <button
        className="border border-indigo-600"
        onClick={() => signOut({ redirect: true, callbackUrl: "/auth/signin" })}
      >
        Logout
      </button>
    </div>
  );
}
