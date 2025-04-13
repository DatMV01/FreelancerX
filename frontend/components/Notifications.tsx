import { Bell } from "lucide-react";

const Notifications = ({ notifications }: { notifications: string[] }) => {
  return (
    <div className="flex gap-2">
      <div className="relative">
        <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
          {notifications.length}
        </span>
        <button className="rounded-full bg-gray-800 p-2 text-white">
          <Bell className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};
