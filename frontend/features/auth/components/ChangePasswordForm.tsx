"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";
import {
  logoutAsync,
  selectAuthStatus,
} from "@/lib/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { PasswordInput } from "./PasswordInput";
import { passwordSchema } from "@/lib/utils";

const formSchema = z
  .object({
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmNewPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Passwords do not match",
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    path: ["newPassword"],
    message: "New password must be different from current password",
  });

type FormValues = z.infer<typeof formSchema>;

export default function ChangePasswordForm() {
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
  const router = useRouter();
  const authStatus = useAppSelector(selectAuthStatus);

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: FormValues) => {
    try {
      const response = await axiosInstanceV1.post("/auth/password/change", {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      reset();
      setCountdown(5);
      toast.success("Password changed successfully!");
    } catch (error: any) {
      console.log(error.response);

      if (
        error?.response?.status === 422 &&
        error?.response?.data?.password === "incorrectPassword"
      ) {
        form.setError("currentPassword", {
          type: "manual",
          message: "Incorrect current password",
        });
      } else {
        const message =
          error?.response?.data?.message || "Failed to change password";
        toast.error(message);
      }
    }
  };

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      dispatch(logoutAsync()).unwrap();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, router]);

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.replace("/auth/login");
    }
  }, [authStatus, router]);

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Change Your Password</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
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
                <FormItem>
                  <FormLabel>
                    New Password
                    <span className="text-muted-foreground block text-xs">
                      Must be at least 6 characters, with a number and a special
                      character
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
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <PasswordInput {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={isSubmitting}
                variant="outline"
                className="rounded-md border border-green-500 px-4 py-2 text-green-600 hover:bg-green-50"
              >
                {isSubmitting ? "Processing..." : "Change Password"}
              </Button>
            </div>
          </form>
        </Form>

        {countdown && countdown > 0 && (
          <div className="text-muted-foreground mt-4 text-center text-sm">
            Logging out in {countdown} seconds...
          </div>
        )}
      </CardContent>
    </Card>
  );
}
