import DashboardLayout from "@/components/layouts/DashboardLayout";
import { ReactElement } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Globe, Facebook, Github, Linkedin } from "lucide-react";

export default function BuyerDashboardProfile() {
  const [avatar, setAvatar] = useState<File | null>(null);
  const [bio, setBio] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    zalo: "",
    telegram: "",
    linkedin: "",
    github: "",
  });

  const platforms = [
    {
      label: "Facebook",
      name: "facebook",
      icon: <Facebook className="h-4 w-4" />,
    },
    { label: "Zalo", name: "zalo", icon: <Globe className="h-4 w-4" /> },
    // {
    //   label: "Telegram",
    //   name: "telegram",
    //   icon: <Telegram className="h-4 w-4" />,
    // },
    {
      label: "LinkedIn",
      name: "linkedin",
      icon: <Linkedin className="h-4 w-4" />,
    },
    { label: "GitHub", name: "github", icon: <Github className="h-4 w-4" /> },
  ];

  const handleChange = (platform: string, value: string) => {
    setSocialLinks((prev) => ({ ...prev, [platform]: value }));
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4">
      <h1 className="text-2xl font-semibold">Quản lý hồ sơ</h1>

      {/* Cập nhật avatar + bio */}
      <Card>
        <CardHeader>
          <CardTitle>Cập nhật Avatar & Bio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="avatar">Ảnh đại diện</Label>
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files?.[0] || null)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Giới thiệu bản thân</Label>
            <Textarea
              id="bio"
              placeholder="Viết vài dòng về bạn..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <Button>Cập nhật thông tin</Button>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle>Liên kết mạng xã hội</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              label: "Facebook",
              name: "facebook",
              placeholder: "https://facebook.com/yourname",
            },
            {
              label: "Zalo",
              name: "zalo",
              placeholder: "https://zalo.me/yourid",
            },
            {
              label: "Telegram",
              name: "telegram",
              placeholder: "https://t.me/yourname",
            },
            {
              label: "LinkedIn",
              name: "linkedin",
              placeholder: "https://linkedin.com/in/yourname",
            },
            {
              label: "GitHub",
              name: "github",
              placeholder: "https://github.com/yourname",
            },
          ].map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>{field.label}</Label>
              <Input
                id={field.name}
                placeholder={field.placeholder}
                value={socialLinks[field.name as keyof typeof socialLinks]}
                onChange={(e) => handleChange(field.name, e.target.value)}
              />
            </div>
          ))}

          <Button>Lưu liên kết</Button>
        </CardContent>
      </Card>

 
    </div>
  );
}

BuyerDashboardProfile.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
