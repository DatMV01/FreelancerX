import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Zod schema
const supportFormSchema = z.object({
  email: z.string().email("Invalid email"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type SupportFormData = z.infer<typeof supportFormSchema>;

function Help() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SupportFormData>({
    resolver: zodResolver(supportFormSchema),
  });

  const onSubmit = async (data: SupportFormData) => {
    console.log("Form submitted:", data);
    // simulate sending
    await new Promise((r) => setTimeout(r, 1000));
    reset();
  };

  return (
    <div className="flex flex-col space-y-6">
      <Card>
        <CardContent className="space-y-4 p-4">
          <p className="flex items-center space-x-2">
            <span>We always listen to your opinions</span>
            <MessageCircle size={18} />
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input placeholder="Email" {...register("email")} />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Input placeholder="Subject" {...register("subject")} />
              {errors.subject && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.subject.message}
                </p>
              )}
            </div>

            <div>
              <Textarea
                placeholder="Message"
                rows={4}
                {...register("message")}
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.message.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-2 p-4">
          <p className="text-sm">You can contact us via email:</p>
          <p className="text-lg font-medium">support@freelancerx.com</p>
          <p className="text-sm">Or call: 0123 456 789</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default Help;
