import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import LogoutButton from "@/features/auth/components/LogoutButton";
import UserAvatar from "@/features/user/components/UserAvatar";
import {
  selectFreelancer,
  selectUser,
} from "@/lib/redux/features/auth/authSlice";
import { useAppSelector } from "@/lib/redux/hooks";
import { route } from "@/lib/route";
import Link from "next/link";

const NavbarLeftPopoverAvatar = () => {
  const user = useAppSelector(selectUser);
  const freelancer = useAppSelector(selectFreelancer);

  const username = user?.email;
  const fullName = user?.fullName;

  const isAdmin = user?.role?.name === "ADMIN";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar showBadge />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <DropdownMenuSeparator />
        <ScrollArea className="max-h-[600px] w-full">
          <div className="flex flex-col">
            <div className="flex items-center gap-3 p-4">
              <UserAvatar height={50} width={50} />
              <div className="flex-1">
                <p className="text-xl font-bold text-gray-700">{fullName}</p>
                <span className="text-md text-gray-500">{user?.email}</span>
              </div>
            </div>
            <DropdownMenuSeparator />

            {isAdmin && (
              <Link
                href={route.admin.dashboard}
                className="flex p-4 hover:bg-green-50 hover:text-green-500"
              >
                Admin Dashboard
              </Link>
            )}

            {!isAdmin && (
              <>
                <Link
                  href={route.buyer.profile}
                  target="_blank"
                  className="flex p-4 hover:bg-green-50 hover:text-green-500"
                >
                  Buyer Dashboarđ
                </Link>

                {freelancer && (
                  <Link
                    href={route.freelancer.profile}
                    target="_blank"
                    className="flex p-4 hover:bg-green-50 hover:text-green-500"
                  >
                    Freelancer Dashboarđ
                  </Link>
                )}

                {!freelancer && (
                  <Link
                    href={route.public.freelancer_signup}
                    className="flex p-4 text-green-500 hover:bg-green-50 hover:text-green-500"
                  >
                    Become a Freelancer
                  </Link>
                )}
              </>
            )}

            {/* Profile Links */}
            {/* <div className="grid h-12 grid-cols-2">
              <Link
                href={`/buyer/profile/${username}`}
                className="flex items-center justify-center text-center hover:bg-green-50 hover:text-green-500"
              >
                Buyer Profile
              </Link>

              {user?.freelancer && (
                <Link
                  href={`/freelancer/profile/${user?.freelancer?.email}`}
                  className="flex items-center justify-center text-center hover:bg-green-50 hover:text-green-500"
                >
                  Freelancer Profile
                </Link>
              )}

              {!user?.freelancer && (
                <Link
                  href="/freelancer/new"
                  className="flex items-center justify-center text-center text-green-500 hover:bg-green-50"
                >
                  Become a Freelancer
                </Link>
              )}
            </div> */}

            {/* Switch Profile & Dashboard Links */}
            {/* 
            {!freelancer && (
              <Link
                href="/freelancer/dashboard"
                className="mx-4 my-2 rounded-sm border border-black py-2 text-center font-bold hover:bg-gray-50 hover:text-green-500"
              >
                Freelancer Dashboard
              </Link>
            )} */}

            {/* <DropdownMenuSeparator />

             <Link
              href={`/setting`}
              className="p-4 hover:bg-green-50 hover:text-green-500"
            >
              Settings
            </Link> */}

            {/* <Link
              href={`/billing`}
              className="p-4 hover:bg-green-50 hover:text-green-500"
            >
              Billing and payments
            </Link> */}
          </div>

          <DropdownMenuSeparator />

          {!isAdmin && (
            <Link
              href={route.public.help}
              target="_blank"
              className="flex p-4 hover:bg-green-50 hover:text-green-500"
            >
              Help & Support
            </Link>
          )}

          <LogoutButton
            className="flex w-full items-center p-4 last:border-none hover:bg-green-50 hover:text-green-500"
            onClickCb={() => {
              window.location.reload();
            }}
          />
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavbarLeftPopoverAvatar;
