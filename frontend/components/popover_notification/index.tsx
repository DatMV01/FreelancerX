import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell } from "lucide-react";
import {
  Badge,
  Divider,
  Avatar,
  Button,
  CircularProgress,
} from "@mui/material";
import { ScrollArea } from "../ui/scroll-area";

const notificationsData = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  message: `Thông báo số ${i + 1}`,
  time: `${i + 1} phút trước`,
  read: i % 2 === 0,
  avatar: `https://i.pravatar.cc/40?img=${(i % 10) + 1}`,
}));

const PopoverNotifications = () => {
  const [visibleCount, setVisibleCount] = useState(10);
  const [notifs, setNotifs] = useState(
    notificationsData.slice(0, visibleCount),
  );

  const [loading, setLoading] = useState(false);

  const markAsRead = (id: any) => {
    setNotifs(
      notifs.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif,
      ),
    );
  };

  const loadMore = () => {
    setLoading(true);
    setTimeout(() => {
      const newCount = visibleCount + 10;
      setVisibleCount(newCount);
      setNotifs(notificationsData.slice(0, newCount));
      setLoading(false);
    }, 2000);
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Badge
          badgeContent={notifs.filter((notif) => !notif.read).length}
          color="success"
          sx={{
            "& .MuiBadge-badge": {
              fontSize: "11px",
              height: "21px",
              minWidth: "21px",
              padding: "0px",
            },
            "&": {
              borderRadius: "100%",
            },
            "&:hover": {
              backgroundColor: "#F3F4F6",
            },
          }}
        >
          <Bell />
        </Badge>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div>
          <div className="flex border-b bg-gray-100 p-3 font-semibold text-gray-700">
            <Bell /> &nbsp; Notifacations (
            {notifs.filter((notif) => !notif.read).length})
          </div>
          <Divider />
          <ScrollArea className="h-[600px] w-full">
            {notifs.length > 0 ? (
              notifs.map((notif) => (
                <div
                  key={notif.id}
                  className="flex cursor-pointer items-center gap-3 border-b p-4 last:border-none hover:bg-gray-100"
                  onClick={() => markAsRead(notif.id)}
                >
                  <Avatar
                    src={notif.avatar}
                    alt="Avatar"
                    sx={{ width: 50, height: 50 }}
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">{notif.message}</p>
                    <span className="text-xs text-gray-500">{notif.time}</span>
                  </div>
                  {!notif.read && (
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  )}
                </div>
              ))
            ) : (
              <div className="p-3 text-gray-500">No Notifications...yet</div>
            )}
          </ScrollArea>
          {visibleCount < notificationsData.length && (
            <div className="p-3 text-center">
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                <Button
                  onClick={loadMore}
                  variant="contained"
                  color="success"
                  sx={{ width: "100%" }}
                  size="small"
                >
                  Load more
                </Button>
              )}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PopoverNotifications;
