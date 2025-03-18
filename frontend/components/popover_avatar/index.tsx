import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, Divider } from "@mui/material";
import { CircleDollarSign } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import AvatarOnline from "../avatar_online";
import { ScrollArea } from "../ui/scroll-area";

const PopoverAvatar = () => {
  const router = useRouter();

  const [visibleCount, setVisibleCount] = useState(10);

  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();

  console.log(session);

  const username = session?.user.username || "fake_user_name";

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
              <Avatar
                src={`https://i.pravatar.cc/40?img=10`}
                alt="Avatar"
                sx={{ width: 50, height: 50 }}
              />
              <div className="flex-1">
                <p className="text-xl font-bold text-gray-700">usename</p>
                <span className="text-md text-gray-500">
                  useremail@gmail.com
                </span>
                <button className="flex text-green-500">
                  <CircleDollarSign size={20} color="#22C55E " /> 100
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2">
              <Link
                href={`/buyer/${username}/profile`}
                className="p-4 text-center hover:bg-green-50 hover:text-green-500"
              >
                Buyer Profile
              </Link>

              <Link
                href={`/seller/${username}/profile`}
                className="p-4 text-center hover:bg-green-50 hover:text-green-500"
              >
                Seller Profile
              </Link>
            </div>

            <Link
              href="/"
              className="mx-4 my-2 rounded-sm border border-black py-2 text-center font-bold hover:bg-gray-50 hover:text-green-500"
            >
              Switch to Buying
            </Link>

            <Link
              href="/seller/dashboard"
              className="mx-4 my-2 rounded-sm border border-black py-2 text-center font-bold hover:bg-gray-50 hover:text-green-500"
            >
              Switch to Seller
            </Link>

            <Divider />

            <Link
              href="/seller/onboarding"
              className="p-4 text-green-500 hover:bg-green-50"
            >
              Become a Seller
            </Link>

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

          <button
            className="flex w-full items-center gap-3 border-b p-4 last:border-none hover:bg-green-50 hover:text-green-500"
            onClick={async () => {
              //signOut({ redirect: true, callbackUrl: "/" });
              await signOut({ redirect: false, callbackUrl: "/" });
              router.push("/");
            }}
          >
            Logout
          </button>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default PopoverAvatar;
