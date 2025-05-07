"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z
  .object({
    email: z.string().email("Invalid email address"),
    fullName: z.string().min(2, "Full Name must be at least 2 characters"),
    password: z.string().min(6, "Must be 6 or more characters long"),
    confirmPassword: z.string().min(6, "Must be 6 or more characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setShowconfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  const [message, setMessage] = useState<{
    type: "success" | "error";
    message: string;
  }>();

  const handleSignUp = async (formData: FormData) => {
    try {
      const response = await axiosInstanceV1.post("auth/email/register", {
        email: formData.email,
        fullName: formData.fullName,
        password: formData.password,
      });

      if (response.status === 201) {
        setMessage({
          type: "success",
          message: "Account created successfully!",
        });
      } else {
        setMessage({
          type: "error",
          message: "Sign up failed. Please try again.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        message: "Sign up failed. Please try again.",
      });
    }
  };

  return (
    <Card className="mx-auto my-10 max-w-md p-4">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleSignUp)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <Input
              type="email"
              {...register("email")}
              placeholder="alice@example.com"
              className="mt-1"
            />
            {errors.email && (
              <p className="my-2 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <Input
              type="text"
              {...register("fullName")}
              placeholder="Alice"
              className="mt-1"
            />
            {errors.fullName && (
              <p className="my-2 text-sm text-red-500">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 pr-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="******"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-2.5 right-2 text-gray-500"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errors.password && (
              <p className="my-2 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">
              Confirm Password
            </label>

            <div className="relative">
              <Input
                type={confirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 pr-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="******"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowconfirmPassword(!confirmPassword)}
                className="absolute top-2.5 right-2 text-gray-500"
                tabIndex={-1}
              >
                {confirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="my-2 text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full rounded-md bg-green-500 py-2 text-white hover:bg-green-600"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Processing..." : "Sign Up"}
          </Button>

          {message && (
            <p
              className={`mt-2 text-center text-sm ${message.type === "success" ? "text-green-500" : "text-red-500"}`}
            >
              {message.message}

              {message?.message === "Account created successfully!" && (
                <div>
                  <a
                    href="/auth/login"
                    className="font-semibold text-green-600"
                  >
                    Click here&nbsp;
                  </a>
                  to login
                </div>
              )}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
