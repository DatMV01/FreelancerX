// components/UpdatePasswordForm.tsx
"use client";

import axios from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";
import { PasswordInput } from "./PasswordInput";
import { useRouter } from "next/router";
import {
  logoutAsync,
  selectAuthStatus,
} from "@/lib/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useEffect, useState } from "react";

const formSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Passwords do not match",
  });

type FormValues = z.infer<typeof formSchema>;

export default function UpdatePasswordForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const dispatch = useAppDispatch();
  const [countdown, setCountdown] = useState<number | null>(null);

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;
  const router = useRouter();
  const onSubmit = async (values: FormValues) => {
    try {
      await axiosInstanceV1.post("/auth/password/change", {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      reset();
      setCountdown(5);
      toast.success("Password updated successfully!");
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to update password";
      toast.error(message);
    }
  };
  const authStatus = useAppSelector(selectAuthStatus);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      dispatch(logoutAsync()).unwrap();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [countdown, router]);

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.replace("/auth/login");
    }
  }, [authStatus, router]);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Update Password</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                //  <FormItem>
                //    <FormLabel>Current Password</FormLabel>
                //    <Input type="password" {...field} />
                //    <FormMessage />
                //  </FormItem>
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <PasswordInput {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                //  <FormItem>
                //    <FormLabel>New Password</FormLabel>
                //    <Input type="password" {...field} />
                //    <FormMessage />
                //  </FormItem>
                <FormItem>
                  <FormLabel>
                    New Password
                    <span className="text-muted-foreground block text-xs">
                      Must be at least 6 characters
                    </span>
                  </FormLabel>
                  <PasswordInput {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmNewPassword"
              render={({ field }) => (
                //  <FormItem>
                //    <FormLabel>Confirm New Password</FormLabel>
                //    <Input type="password" {...field} />
                //    <FormMessage />
                //  </FormItem>
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <PasswordInput {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </Form>

        {countdown && countdown > 0 && (
          <div className="text-center">
            Logging out in {countdown} seconds...
          </div>
        )}
      </CardContent>
    </Card>
  );
}
