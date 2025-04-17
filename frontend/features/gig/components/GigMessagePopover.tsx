import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import UserAvatar from "@/features/user/components/UserAvatar";
import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";

const GigMessagePopover = ({ freelancer }: { freelancer: any }) => {
  const searchParams = useSearchParams();
  const dev = false || searchParams.get("dev");

  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();
  const [displayName, setDisplayName] = useState("DisplayName");
  const [phone, setPhone] = useState("phone");

  const { data, error, isLoading } = useSWR(
    `/freelancer/profile/${freelancer.email}`,
    (url: string) => axiosInstanceV1.get(url).then((res) => res.data),
  );

  useEffect(() => {
    if (data) {
      console.log("data", data);

      setAvatarUrl(data?.avatar);
      setDisplayName(data?.displayName);
      setPhone(data?.phone);
    }
  }, [data]);

  if (isLoading) return null;

  return (
    <Popover>
      <PopoverTrigger className="rounded-full bg-green-100 p-2">
        <div className="flex items-center justify-center space-x-2">
          <UserAvatar avatarUrl={avatarUrl} fullName={displayName} />

          <p className="font-semibold">
            Mesage to {displayName || "Full Name"}
          </p>
        </div>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="center"
        className="w-50 border-none bg-transparent p-0"
      >
        <div className="flex flex-col space-y-2">
          <a
            href={`https://zalo.me/${phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center space-x-2 rounded-full bg-green-200 p-2"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg"
              alt="Zalo"
              width={30}
              height={30}
              className="cursor-pointer"
            />
            <span className="font-semibold">Zalo </span>
          </a>

          {dev && (
            <a
              href={`https://zalo.me/${phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center space-x-2 rounded-full bg-green-200 p-2"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg"
                alt="Telegram"
                width={30}
                height={30}
                className="cursor-pointer"
              />
              <span className="font-semibold">Telegram </span>
            </a>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default GigMessagePopover;
