import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import AvatarOnline from "@/components/avatar_online";

const GigMessagePopover = ({ seller }: { seller: any }) => {
  return (
    <Popover>
      <PopoverTrigger className="sticky bottom-10 rounded-full border-[1px] bg-white p-2">
        <div className="flex items-center justify-center space-x-2">
          <AvatarOnline />
          <p className="font-semibold">Mesage username</p>
        </div>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="center"
        className="w-fit bg-gray-50 p-2"
      >
        <div className="flex flex-col space-y-2">
          <button
            className="sticky bottom-10 rounded-full border-[1px] bg-white p-2"
            onClick={() => console.log("abc")}
          >
            <div className="flex items-center justify-center space-x-2">
              <img
                className="h-8 w-8"
                src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg"
              />
              <p className="font-semibold">Zalo </p>
            </div>
          </button>

          <button
            className="sticky bottom-10 rounded-full border-[1px] bg-white p-2"
            onClick={() => console.log("abc")}
          >
            <div className="flex items-center justify-center space-x-2">
              <img
                className="h-8 w-8"
                src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg"
              />
              <p className="font-semibold">Telegram </p>
            </div>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default GigMessagePopover;
