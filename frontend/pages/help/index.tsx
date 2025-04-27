import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle } from "lucide-react";

export default function HelpAndSupport() {
  return (
    <div className="flex flex-col space-y-6">
      <h1 className="rounded-md border border-green-500 p-4 text-center text-2xl font-bold text-green-500">
        Help
      </h1>
      <Card>
        <CardContent className="space-y-4 p-4">
          <p className="flex items-center space-x-2">
            <span>We always listen to your opinions </span>
            <MessageCircle size={18} />
          </p>
          <form className="space-y-4">
            <Input placeholder="Email" />

            <Input placeholder="Title" />
            <Textarea placeholder="Content..." rows={4} />
            <Button type="submit">Send</Button>
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
