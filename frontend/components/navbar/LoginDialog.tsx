"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LoginForm from "@/features/auth/components/LoginForm";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { VisuallyHidden } from "radix-ui";

const LoginDialog = () => {
  const [isShowLoginForm, setShowLoginForm] = useState(false);
  const { status } = useSession();

  return (
    <>
      {status !== "authenticated" && (
        <Dialog open={isShowLoginForm} onOpenChange={setShowLoginForm}>
          <DialogTrigger asChild>
            <button className="whitespace-nowrap rounded-sm border border-green-500 px-2 py-1 text-green-500">
              Login
            </button>
          </DialogTrigger>

          <DialogContent className="w-full max-w-md rounded-md bg-white px-0 py-4">
            <VisuallyHidden.Root>
              <DialogTitle>Login</DialogTitle>
              <DialogDescription>Sign in to your account</DialogDescription>
            </VisuallyHidden.Root>

            <LoginForm setShowLoginForm={setShowLoginForm} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default LoginDialog;
