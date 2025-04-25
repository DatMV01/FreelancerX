import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getFreelancerProfileByEmail } from "@/features/freelancer/freelancer.api";

import UserAvatar from "@/features/user/components/UserAvatar";
import { useRouter } from "next/router";
import useSWR from "swr";

const GigMessagePopover = ({ freelancer }: { freelancer: any }) => {
  const roưter = useRouter();
  const { dev } = roưter.query;

  const email = freelancer.email;
  const { data, error, isLoading, isValidating } = useSWR(
    `/profile/email/${email}`,
    () => getFreelancerProfileByEmail(email),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
      dedupingInterval: 300000, // 5 minutes
    },
  );

  if (isLoading || isValidating) return null;

  return (
    <Popover>
      <PopoverTrigger className="rounded-full bg-green-100 p-2">
        <div className="flex items-center justify-center space-x-2">
          <UserAvatar avatarUrl={data?.avatar} fullName={data?.displayName} />

          <p className="font-semibold">
            Mesage to {data?.displayName || "Full Name"}
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
            href={`https://zalo.me/${data?.phone}`}
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
              href={`https://zalo.me/${data?.phone}`}
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
