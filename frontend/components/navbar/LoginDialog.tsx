"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SignInForm from "@/features/auth/components/LoginForm";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { VisuallyHidden } from "radix-ui";
import { useEffect, useState } from "react";

const LoginDialog = () => {
  const [isShowLoginForn, setShowLoginForm] = useState(false);
  const [isShowSignInButton, setShowJoinButton] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      setShowJoinButton(false);
    }
    if (status === "unauthenticated" || status === "loading") {
      setShowJoinButton(true);
    }
  }, [status, router]);

  return (
    <Dialog open={isShowLoginForn} onOpenChange={setShowLoginForm}>
      {isShowSignInButton && (
        <DialogTrigger
          asChild
          className="justify-self-end text-base font-bold md:block"
        >
          <button className="whitespace-nowrap rounded-sm border-[1px] border-green-500 px-2 py-1 text-green-500">
            Sign In
          </button>
        </DialogTrigger>
      )}

      <DialogContent className="max-w-fit rounded-xl bg-white px-0 py-[16px]">
        <VisuallyHidden.Root>
          <DialogTitle>DialogTitle</DialogTitle>
          <DialogDescription>DialogDescription</DialogDescription>
        </VisuallyHidden.Root>

        <SignInForm setShowLoginForm={setShowLoginForm} />
      </DialogContent>
    </Dialog>
  );
};
export default LoginDialog;
