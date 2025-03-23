import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import UserAvatar from "@/features/user/components/UserAvatar";

const GigMessagePopover = ({ sellerName }: { sellerName: string }) => {
  return (
    <Popover>
      <PopoverTrigger className="rounded-full bg-white p-2">
        <div className="flex items-center justify-center space-x-2">
          <UserAvatar />
          <p className="font-semibold">Mesage {sellerName}</p>
        </div>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="center"
        className="w-fit bg-gray-50 p-2"
      >
        <div className="flex flex-col space-y-2">
          <button
            className="rounded-full bg-white p-2"
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
            className="rounded-full bg-white p-2"
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
