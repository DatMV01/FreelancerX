"use client";

import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import CircularProgressCenter from "./CircularProgressCenter";

type LoginFormProps = {
  email: string;
  password: string;
};

export default function LoginForm({setLoading} :{setLoading: any}) {
  const [error, setError] = useState("");
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormProps>({
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      email: "amina_bogan@yahoo.com",
      password: "user123",
    },
  });

  const handleSubmitForm = async (data: {
    email: string;
    password: string;
  }) => {
    setLoading(true);

    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password");
    } else {  
      router.push("/dashboard");
    }
  };

  return (
    <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
      <form className="space-y-6" onSubmit={handleSubmit(handleSubmitForm)}>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Email address
          </label>
          <div className="mt-2">
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className={clsx(
                "block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm",
                "ring-1 ring-inset ring-gray-300 placeholder:text-gray-400",
                "focus:ring-2 focus:ring-inset focus:ring-indigo-600",
                "sm:text-sm sm:leading-6",
              )}
            />
          </div>
          <span className="text-xs text-red-500">{errors.email?.message}</span>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Password
            </label>
          </div>
          <div className="mt-2">
            <input
              {...register("password", {
                required: "Password is required",
              })}
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className={clsx(
                "block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm",
                "ring-1 ring-inset ring-gray-300 placeholder:text-gray-400",
                "focus:ring-2 focus:ring-inset focus:ring-indigo-600",
                "sm:text-sm sm:leading-6",
              )}
            />
          </div>
          <span className="text-xs text-red-500">
            {errors.password?.message}
          </span>
        </div>
        <div>
          <button
            type="submit"
            className={clsx(
              "flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5",
              "text-sm font-semibold leading-6 text-white shadow-sm",
              "hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2",
              "focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
            )}
          >
            Sign in
          </button>
        </div>
      </form>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
