import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type FormType = z.infer<typeof formSchema>;

export default function ResetPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
  } = useForm<FormType>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "mamotgio@gmail.com",
    },
  });

  const [message, setMessage] = useState<{
    type: "success" | "errror";
    message: string;
  }>();

  const handleForgotPassword = async (formData: FormType) => {
    try {
      const response = await axiosInstanceV1.post(
        `auth/password/forgot`,
        formData,
      );

      if (response.status === 200) {
        setMessage({
          type: "success",
          message: "Password reset request has been sent to your email !",
        });
      } else {
        setMessage({
          type: "errror",
          message: "An error occurred. Please try again.",
        });
      }
    } catch (error) {
      setMessage({
        type: "errror",
        message: "An error occurred. Please try again.",
      });
    }
  };

  return (
    <Card className="mx-auto my-10 max-w-md">
      <CardHeader>
        <CardTitle>Forgot Password</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(handleForgotPassword)}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium">Email</label>
            <Input type="email" {...register("email")} className="mt-1" />
            {errors.email && (
              <p className="my-2 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* ✅ Submit Button */}
          <Button
            type="submit"
            className="w-full rounded-md bg-green-500 py-2 text-white hover:bg-green-600"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Processing..." : "Login"}
          </Button>

          {/* ✅ Success & Error Messages */}
          {message && (
            <p
              className={`mt-2 text-center text-sm ${message.type === "success" ? "text-green-500" : "text-red-500"}`}
            >
              {message.message}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
