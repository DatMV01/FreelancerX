"use client";

import CircularProgressCenter from "@/components/CircularProgressCenter";
import { loginAsync } from "@/lib/redux/features/auth/authSlice";
import { useAppDispatch } from "@/lib/redux/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().min(6, { message: "Invalid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  // .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  // .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
  // .regex(/[0-9]/, { message: "Password must contain at least one digit" }),
});

type FormType = z.infer<typeof formSchema>;

type Props = {
  setShowLoginForm?: (value: boolean) => void;
  loginSuccessCb?: () => void;
};

export default function LoginForm({ setShowLoginForm, loginSuccessCb }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
  } = useForm<FormType>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "admin@example.com",
      password: "user123",
    },
  });

  const [message, setMessage] = useState<{
    type: "success" | "errror";
    message: string;
  }>();

  const handleLogin = async (formData: FormType) => {
    const res = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    if (res?.error) {
      setMessage({
        type: "errror",
        message: "Email or password is not correct.",
      });
    } else if (res?.status === 200) {
      setShowLoginForm && setShowLoginForm(false);

      loginSuccessCb && loginSuccessCb();
    } else {
      setMessage({
        type: "errror",
        message: "An error occurred. Please try again.",
      });
    }

    // try {
    //   const res = (await dispatch(
    //     loginAsync({
    //       provider: "credentials",
    //       email: formData.email,
    //       password: formData.password,
    //     }),
    //   ).unwrap()) as any; // Unwrap to handle the success/failure directly

    //   debugger;
    //   if (res?.error) {
    //     setMessage({
    //       type: "errror",
    //       message: "Email or password is not correct.",
    //     });
    //   } else {
    //     setShowLoginForm && setShowLoginForm(false);

    //     loginSuccessCb && loginSuccessCb();
    //   }
    // } catch (err) {
    //   setMessage({
    //     type: "errror",
    //     message: "An error occurred. Please try again.",
    //   });
    // }
  };

  return (
    <div className="flex w-full max-w-lg flex-col items-center justify-center px-4">
      <h2 className="mb-4 text-center text-xl font-semibold">Login</h2>
      <form onSubmit={handleSubmit(handleLogin)} className="w-full space-y-2">
        <div>
          <label className="block text-base font-medium text-gray-700">
            Email
          </label>
          <input
            type="text"
            {...register("email")}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="johndoe@mail.com"
            autoComplete="email"
          />
          {errors.email && (
            <p className="my-2 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="block text-base font-medium text-gray-700">
              Password
            </label>

            <Link
              onClick={() => setShowLoginForm && setShowLoginForm(false)}
              href="/auth/password/forgot"
              className="text-sm underline"
            >
              Forgot your password?
            </Link>
          </div>

          <input
            type="password"
            {...register("password")}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="******"
            autoComplete="current-password"
          />

          {errors.password && (
            <p className="my-2 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* ✅ Submit Button */}
        <button
          type="submit"
          className="w-full rounded-md bg-green-500 py-2 text-white hover:bg-green-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        {/* <button
          type="button"
          className="flex w-full justify-center space-x-2 rounded-md border border-gray-300 py-2 hover:bg-gray-100"
          disabled={isSubmitting}
        >
          <Image
            src="/images/icons/google.svg"
            width="20"
            height="20"
            alt="Google"
          />

          <span>Login with Google</span>
        </button> */}

        {/* ✅ Success & Error Messages */}
        {message && (
          <p
            className={`mt-2 text-center text-sm ${message.type === "success" ? "text-green-500" : "text-red-500"}`}
          >
            {message.message}
          </p>
        )}
      </form>
      <div className="mt-4 text-center text-sm">
        <span>Don&apos;t have an account?&nbsp;</span>
        <Link
          href="/auth/signup"
          onClick={() => setShowLoginForm && setShowLoginForm(false)}
          className="underline"
        >
          Sign up
        </Link>
      </div>
      {isSubmitting && <CircularProgressCenter />}
    </div>
  );
}
