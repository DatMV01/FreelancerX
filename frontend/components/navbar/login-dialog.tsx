"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { useState } from "react";
import SignInForm from "../form/signin";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DialogDescription } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "radix-ui";

const LoginDialog = () => {
  const [isShowLoginForn, setShowLoginForm] = useState(false);
  const [isShowJoinButton, setShowJoinButton] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      setShowJoinButton(false);
    }
    if (status === "unauthenticated") {
      setShowJoinButton(true);
    }
  }, [status, router]);

  return (
    <Dialog open={isShowLoginForn} onOpenChange={setShowLoginForm}>
      {isShowJoinButton && (
        <DialogTrigger
          asChild
          className="justify-self-end text-base font-bold md:block"
        >
          <button>Join</button>
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
