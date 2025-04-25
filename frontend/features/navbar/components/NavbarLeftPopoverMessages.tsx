import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Avatar,
  Badge,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";
import { Mail } from "lucide-react";
import { useState } from "react";

const messagesData = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  sender: `User ${i + 1}`,
  text: `This is message ${i + 1}`,
  time: `${i + 1}m ago`,
  avatar: `https://i.pravatar.cc/40?img=${(i % 10) + 1}`,
  read: i % 2 === 0,
}));

const NavbarLeftPopoverMessages = () => {
  const [visibleCount, setVisibleCount] = useState(10);
  const [messages, setMessages] = useState(messagesData.slice(0, visibleCount));

  const [loading, setLoading] = useState(false);

  const markAsRead = (id: any) => {
    setMessages(
      messages.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif,
      ),
    );
  };

  const loadMore = () => {
    setLoading(true);
    setTimeout(() => {
      const newCount = visibleCount + 10;
      setVisibleCount(newCount);
      setMessages(messagesData.slice(0, newCount));
      setLoading(false);
    }, 2000);
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Badge
          badgeContent={messages.filter((notif) => !notif.read).length}
          color="success"
          sx={{
            "& .MuiBadge-badge": {
              fontSize: "11px",
              height: "21px",
              minWidth: "21px",
              padding: "0px",
              zIndex: "10",
            },
            "&": {
              borderRadius: "100%",
            },
            "&:hover": {
              backgroundColor: "#F3F4F6",
            },
          }}
        >
          <Mail />
        </Badge>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div>
          <div className="flex border-b bg-gray-100 p-3 font-semibold text-gray-700">
            <Mail /> &nbsp; Messages (
            {messages.filter((notif) => !notif.read).length})
          </div>
          <Divider />
          <ScrollArea className="h-[600px] w-full">
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className="flex cursor-pointer items-center gap-3 border-b px-4 py-2 last:border-none hover:bg-gray-100"
                  onClick={() => markAsRead(msg.id)}
                >
                  <Avatar
                    src={msg.avatar}
                    alt={msg.sender}
                    sx={{ width: 50, height: 50 }}
                  />
                  <div className="flex-1">
                    <p className="text-md font-semibold text-gray-700">
                      {msg.sender}
                    </p>
                    <p className="text-sm text-gray-700">{msg.text}</p>
                    <span className="text-xs text-gray-500">{msg.time}</span>
                  </div>

                  {!msg.read && (
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  )}
                </div>
              ))
            ) : (
              <div className="p-3 text-gray-500">No Notifications...yet</div>
            )}
          </ScrollArea>
          {visibleCount < messagesData.length && (
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

export default NavbarLeftPopoverMessages;
