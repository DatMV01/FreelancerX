"use client";
import LoginButton from "@/components/buttons/LoginButton";
import CircularProgressCenter from "@/components/CircularProgressCenter";
import Divider from "@/components/Divider";
import LoginForm from "@/components/LoginForm";
import { useState } from "react";

export default function LoginPage() {
  const [isLoading, setLoading] = useState(false);

  return (
    <div className="relative flex h-screen items-center justify-center ">
      <div className="flex w-[500px] flex-col items-center justify-center">
        <p className="text-3xl font-bold">Sign in to your account</p>
        <LoginForm setLoading={setLoading} />
        <Divider />
        <LoginButton auth={{ id: "Google", name: "Google" }} />
      </div>
      {isLoading && <CircularProgressCenter />}
    </div>
  );
}
