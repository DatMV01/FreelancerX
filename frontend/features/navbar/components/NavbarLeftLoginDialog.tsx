"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LoginForm from "@/features/auth/components/LoginForm";
import {
  selectAuthStatus,
  selectUser,
} from "@/lib/redux/features/auth/authSlice";
import { useAppSelector } from "@/lib/redux/hooks";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Loader2 } from "lucide-react";
import { VisuallyHidden } from "radix-ui";
import { useState } from "react";

const NavbarLeftLoginDialog = () => {
  const user = useAppSelector(selectUser);
  const authStatus = useAppSelector(selectAuthStatus);

  const [isShowLoginForm, setShowLoginForm] = useState(false);

  return (
    <div>
      {authStatus === "loading" && (
        <Loader2 className="animate-spin" size={18} />
      )}

      {authStatus === "unauthenticated" && !user && (
        <Dialog open={isShowLoginForm} onOpenChange={setShowLoginForm}>
          <DialogTrigger asChild>
            <button className="rounded-sm border border-green-500 px-2 py-1 whitespace-nowrap text-green-500">
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
    </div>
  );
};

export default NavbarLeftLoginDialog;
