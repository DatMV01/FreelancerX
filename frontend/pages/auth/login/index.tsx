"use client";

import LoginForm from "@/features/auth/components/LoginForm";
import { useRouter } from "next/router";
export default function LoginPage() {
  const router = useRouter();

  const loginSuccessCallback = () => {
    router.push("/");
  };

  return (
    <div className="my-6 flex justify-center">
      <LoginForm loginSuccessCb={loginSuccessCallback} />
    </div>
  );
}
