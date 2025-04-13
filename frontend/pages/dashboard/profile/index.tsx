"use client";

import { ReactElement, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { toast } from "sonner";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const mockData = { message: "Hello, world!" }; // Simulated mock data
  return new Promise(
    (resolve) => setTimeout(() => resolve(mockData), 2000), // Simulate a 2-second fetch
  );
};

export default function AccountPage() {
  const [bio, setBio] = useState("I'm a freelancer passionate about UI.");
  const [avatarUrl, setAvatarUrl] = useState("https://i.pravatar.cc/150?u=me");

  // Simulating data fetching with SWR
  const { data, error } = useSWR("/api/data", fetcher);

  // Handling loading and error states
  if (error) return <div>Error loading data</div>;

  return (
    <div className="max-w-xl space-y-6">
      <h2 className="text-2xl font-bold">Profile Settings</h2>

      <div className="space-y-4">
        <label className="block text-sm font-medium">Avatar</label>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <Input
            type="url"
            placeholder="Paste image URL..."
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Bio</label>
        <Textarea value={bio} onChange={(e) => setBio(e.target.value)} />
      </div>

      <div className="space-y-4 pt-8">
        <h3 className="text-lg font-semibold">Change Password</h3>
        <Input type="password" placeholder="Current password" />
        <Input type="password" placeholder="New password" />
        <Input type="password" placeholder="Confirm new password" />
        <Button
          onClick={() => {
            toast.success("Password changed!");
          }}
        >
          Update Password
        </Button>
      </div>

      <Button
        onClick={() => {
          toast.success(" Save Changes");
        }}
      >
        Save Changes
      </Button>
    </div>
  );
}

AccountPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
