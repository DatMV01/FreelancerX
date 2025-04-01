"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { axiosInstanceV1 } from "@/lib/apiClient";
import { zodResolver } from "@hookform/resolvers/zod";
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
        message: "An error occurred. Please try again.",
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
            <Input type="email" {...register("email")} className="mt-1" />
            {errors.email && (
              <p className="my-2 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <Input type="text" {...register("fullName")} className="mt-1" />
            {errors.fullName && (
              <p className="my-2 text-sm text-red-500">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <Input type="password" {...register("password")} className="mt-1" />
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

          <Button type="submit" disabled={isSubmitting} className="w-full">
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
