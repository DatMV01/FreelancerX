"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import clsx from "clsx";

const Icon = ({ provider }: { provider: string }) => {
  let imagePath = "";

  if (provider === "Google") {
    imagePath = "/images/icons/google.svg";
  } else if (provider === "Discord") {
    imagePath = "/images/icons/discord.svg";
  } else if (provider === "Auth0") {
    imagePath = "/images/icons/auth0.svg";
  }

  return (
    <Image
      src={imagePath}
      width="25"
      height="25"
      alt="Google"
      className="mr-4"
    />
  );
};

export default function LoginButton({ auth }: { auth: any }) {
  return (
    <button
      type="button"
      className={clsx(
        "shadow-1 rounded-md border px-6 py-3 text-sm font-semibold shadow-sm",
        "focus-visible:outline focus-visible:outline-2",
        "focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
      )}
      onClick={() => signIn(auth?.id)}
    >
      {auth ? (
        <div className="flex items-center">
          <Icon provider={auth.name} />
          Sign In with {auth.name}
        </div>
      ) : (
        "Custom Login Page"
      )}
    </button>
  );
}
