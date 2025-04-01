import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Store } from "lucide-react";
import {
  Badge,
  Divider,
  Button,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { ScrollArea } from "../ui/scroll-area";
import Image from "next/image";

const ORDER_STATUSES = [
  "PENDING",
  "ACTIVE",
  "REVISION_REQUESTED",
  "COMPLETED",
  "CANCELLED",
  "LATE",
  "DISPUTED",
  "IN_PROGRESS",
];

const ordersData = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  gigTitle: `Gig số ${i + 1}: Tôi sẽ lập trình ứng dụng theo yêu cầu`,
  seller: `seller_${i + 1}`,
  image: `https://i.pravatar.cc/100?img=${(i % 10) + 1}`,
  status: ORDER_STATUSES[i % ORDER_STATUSES.length],
  read: i % 2 === 0,
}));

const getStatusColor = (status: any) => {
  switch (status) {
    case "PENDING":
      return "text-yellow-500";
    case "ACTIVE":
    case "IN_PROGRESS":
      return "text-blue-500";
    case "REVISION_REQUESTED":
      return "text-orange-500";
    case "COMPLETED":
      return "text-green-500";
    case "CANCELLED":
      return "text-red-500";
    case "LATE":
      return "text-red-400";
    case "DISPUTED":
      return "text-purple-500";
    default:
      return "text-gray-500";
  }
};

const PopoverOrders = () => {
  const [visibleCount, setVisibleCount] = useState(10);
  const [orders, setOrders] = useState(ordersData.slice(0, visibleCount));
  const [loading, setLoading] = useState(false);

  const markAsRead = (id: any) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id && !order.read ? { ...order, read: true } : order,
      ),
    );
  };

  const loadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => {
        const newCount = prev + 10;
        setOrders(ordersData.slice(0, newCount));
        return newCount;
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <Popover>
      <Tooltip title="View Orders">
        <PopoverTrigger>
          <Badge
            badgeContent={orders.filter((order) => !order.read).length}
            color="success"
            sx={{
              "& .MuiBadge-badge": {
                fontSize: "11px",
                height: "21px",
                minWidth: "21px",
              },
            }}
          >
            <Store />
          </Badge>
        </PopoverTrigger>
      </Tooltip>

      <PopoverContent align="end" className="w-80 p-0">
        <div>
          <div className="flex border-b bg-gray-100 p-3 font-semibold text-gray-700">
            <Store /> &nbsp; Orders
          </div>
          <Divider />
          <ScrollArea className="h-[600px] w-full">
            {orders.length > 0 ? (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="flex cursor-pointer items-center gap-3 border-b p-4 last:border-none hover:bg-gray-100"
                  onClick={() => markAsRead(order.id)}
                >
                  <div className="relative h-14 w-14 flex-shrink-0">
                    <Image
                      src={order.image}
                      alt="Gig Thumbnail"
                      fill
                      className="rounded-sm"
                    />
                  </div>

                  <div className=" ">
                    <p className="text-sm font-medium">{order.gigTitle}</p>
                    <p className="text-xs text-gray-500">
                      by &nbsp;
                      <span className="font-semibold text-gray-700">
                        {order.seller}
                      </span>
                    </p>
                    <p
                      className={`text-xs font-semibold ${getStatusColor(order.status)}`}
                    >
                      {order.status.replace(/_/g, " ")}
                    </p>
                  </div>

                  {!order.read && (
                    <span className="h-2 w-2 flex-shrink-0 rounded-full bg-green-500"></span>
                  )}
                </div>
              ))
            ) : (
              <div className="p-3 text-gray-500">No Saved Orders... yet</div>
            )}
          </ScrollArea>

          {visibleCount < ordersData.length && (
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

export default PopoverOrders;
