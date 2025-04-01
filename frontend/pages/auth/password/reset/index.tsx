"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { axiosInstanceV1 } from "@/lib/apiClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Must be 6 or more characters long" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Must be 6 or more characters long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Highlight confirmPassword field on error
  });

type FormData = z.infer<typeof schema>;

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const expires = searchParams.get("expires");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  const [message, setMessage] = useState<{
    type: "success" | "error";
    message: string;
  }>();

  if (!expires || Number(expires) < Date.now()) {
    return (
      <div className="flex min-h-screen items-center justify-center text-center">
        <p className="text-lg text-red-500">
          <span>Token is expired.&nbsp;</span>
          <a className="text-blue-500 underline" href="/auth/password/forgot">
            Click here
          </a>
          <span>&nbsp;to request a new one.</span>
        </p>
      </div>
    );
  }

  const handleResetPassword = async (formData: FormData) => {
    try {
      const response = await axiosInstanceV1.post(`auth/password/reset`, {
        token,
        newPassword: formData.password,
      });

      if (response.status === 200) {
        setMessage({
          type: "success",
          message: "Password reset successfully!",
        });
      } else {
        setMessage({ type: "error", message: "Password reset failed." });
      }
    } catch (error) {
      setMessage({
        type: "error",
        message: "An error occurred. Please try again.",
      });
    }
  };

  return (
    <Card className="mx-auto my-10 max-w-md p-4">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(handleResetPassword)}
          className="space-y-4"
        >
          {/* ✅ Password Field */}
          <div>
            <label className="block text-sm font-medium">Password</label>
            <Input type="password" {...register("password")} className="mt-1" />
            {errors.password && (
              <p className="my-2 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* ✅ Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium">
              Confirm Password
            </label>
            <Input
              type="password"
              {...register("confirmPassword")}
              className="mt-1"
            />
            {errors.confirmPassword && (
              <p className="my-2 text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* ✅ Submit Button */}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Processing..." : "Reset Password"}
          </Button>

          {/* ✅ Success & Error Messages */}
          {message && (
            <p
              className={`mt-2 text-center text-sm ${message.type === "success" ? "text-green-500" : "text-red-500"}`}
            >
              {message.message}

              {message.message === "Password reset successfully!" && (
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
