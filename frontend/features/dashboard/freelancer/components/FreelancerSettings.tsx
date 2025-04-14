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

      {/* Quản lý bảo mật */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">🔐 Quản lý bảo mật</h2>
        <div className="space-y-4">
          <div>
            <Label className="text-sm">Mật khẩu mới</Label>
            <Input
              type="password"
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Button onClick={handleUpdatePassword} className="mt-4">
              Cập nhật mật khẩu
            </Button>
          </div>
          <div>
            <Label className="text-sm">Xác thực 2 yếu tố (2FA)</Label>
            <p className="text-muted-foreground text-sm">
              Thiết lập bảo mật 2FA cho tài khoản của bạn.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Thiết lập 2FA</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thiết lập xác thực 2 yếu tố</DialogTitle>
                </DialogHeader>
                <p>Hướng dẫn thiết lập 2FA sẽ được hiển thị ở đây.</p>
                <DialogFooter>
                  <Button variant="secondary">Hủy</Button>
                  <Button>Tiếp tục</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Thiết lập thông báo */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">🔔 Thiết lập thông báo</h2>
        <div className="space-y-4">
          <div>
            <Label>Email Notifications</Label>
            <Select
              value={emailNotifications ? "enabled" : "disabled"}
              onValueChange={(val) => setEmailNotifications(val === "enabled")}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="enabled">Bật</SelectItem>
                <SelectItem value="disabled">Tắt</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Thông báo Push</Label>
            <Select
              value={pushNotifications ? "enabled" : "disabled"}
              onValueChange={(val) => setPushNotifications(val === "enabled")}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="enabled">Bật</SelectItem>
                <SelectItem value="disabled">Tắt</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={handleSaveChanges} className="mt-4">
          Lưu thay đổi
        </Button>
      </div>
    </div>
  );
}
