import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";

export default function FreelancerSettings() {
  const [userInfo, setUserInfo] = useState({
    name: "John Doe",
    bio: "Freelance Developer specializing in React.",
    avatar: "/avatar.jpg", // placeholder avatar image URL
  });

  const [newPassword, setNewPassword] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  const handleSaveChanges = () => {
    toast.success("Thông tin đã được cập nhật!");
  };

  const handleUpdatePassword = () => {
    if (!newPassword) {
      toast.error("Mật khẩu mới không được để trống!");
      return;
    }

    toast.success("Mật khẩu đã được thay đổi!");
    setNewPassword(""); // Clear password field
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Cập nhật thông tin cá nhân */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">
          📄 Cập nhật thông tin cá nhân
        </h2>
        <div className="mb-4 flex">
          <img
            src={userInfo.avatar}
            alt="Avatar"
            className="mr-4 h-20 w-20 rounded-full"
          />
          <div className="flex flex-col">
            <Button className="mb-2 w-fit">Thay đổi avatar</Button>
            <Label className="text-sm">Tên</Label>
            <Input
              type="text"
              value={userInfo.name}
              onChange={(e) =>
                setUserInfo({ ...userInfo, name: e.target.value })
              }
              className="mb-2"
            />
            <Label className="text-sm">Mô tả (Bio)</Label>
            <Input
              type="text"
              value={userInfo.bio}
              onChange={(e) =>
                setUserInfo({ ...userInfo, bio: e.target.value })
              }
            />
            <Button onClick={handleSaveChanges} className="mt-4">
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </div>
 

      
    </div>
  );
}
