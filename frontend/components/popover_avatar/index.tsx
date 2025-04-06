import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import LogoutButton from "@/features/auth/components/LogoutButton";
import { selectUser } from "@/lib/redux/features/auth/authSlice";
import { useAppSelector } from "@/lib/redux/hooks";
import { Divider } from "@mui/material";
import { CircleDollarSign } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import AvatarOnline from "../avatar_online/AvatarOnline";
import { ScrollArea } from "../ui/scroll-area";
import clsx from "clsx";

const PopoverAvatar = () => {
  const router = useRouter();

  //const { isAuthenticated, user, session } = useGetUserInfo();

  const user = useAppSelector(selectUser);

  const username = user?.email;
  const fullName = user?.fullName;
  const isFreelancer = user?.freelancer;

  return (
    <Popover>
      <PopoverTrigger>
        <AvatarOnline />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <Divider />
        <ScrollArea className="max-h-[600px] w-full">
          <div className="flex flex-col">
            <div className="flex items-center gap-3 p-4">
              <AvatarOnline height={50} width={50} />

              <div className="flex-1">
                <p className="text-xl font-bold text-gray-700">{fullName}</p>
                <span className="text-md text-gray-500">{user?.email}</span>
              </div>
            </div>

            <div className="grid h-12 grid-cols-2">
              <Link
                href={`/buyer/profile/${username}`}
                className="flex items-center justify-center text-center hover:bg-green-50 hover:text-green-500"
              >
                Buyer Profile
              </Link>
              {user?.freelancer && (
                <Link
                  href={`/freelancer/profile/${user?.freelancer?.email}`}
                  className={clsx(
                    "flex items-center justify-center text-center hover:bg-green-50 hover:text-green-500",
                  )}
                >
                  Freelancer Profile
                </Link>
              )}

              {!user?.freelancer && (
                <Link
                  href="/freelancer/onboarding"
                  className={clsx(
                    "flex items-center justify-center text-center text-green-500 hover:bg-green-50",
                  )}
                >
                  Become a Freelancer
                </Link>
              )}
            </div>

            <Link
              href="/"
              className="mx-4 my-2 rounded-sm border border-black py-2 text-center font-bold hover:bg-gray-50 hover:text-green-500"
            >
              Switch to Buying
            </Link>

            {!isFreelancer && (
              <Link
                href="/freelancer/dashboard"
                className="mx-4 my-2 rounded-sm border border-black py-2 text-center font-bold hover:bg-gray-50 hover:text-green-500"
              >
                Freelancer Dashboard
              </Link>
            )}

            <Divider />

            <Link
              href={`/setting`}
              className="p-4 hover:bg-green-50 hover:text-green-500"
            >
              Settings
            </Link>

            <Link
              href={`/billing`}
              className="p-4 hover:bg-green-50 hover:text-green-500"
            >
              Billing and payments
            </Link>
          </div>

          <Divider />

          <Link
            href={`/help`}
            rel="noopener noreferrer"
            target="_blank"
            className="flex p-4 hover:bg-green-50 hover:text-green-500"
          >
            Help & Support
          </Link>

          <LogoutButton
            className="flex w-full items-center gap-3 border-b p-4 last:border-none hover:bg-green-50 hover:text-green-500"
            onClickCb={() => {
              console.log("======================= logout cb call");
            }}
          />
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default PopoverAvatar;
