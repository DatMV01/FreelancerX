import { InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import { authOptions } from "./api/auth/[...nextauth]";
import GuestHomePage from "./home/guest_homepage";
import UserHomePage from "./home/user_homepage";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions);

  return {
    props: {
      isLogin: session ? true : false,
    },
  };
}

export default function Index({
  isLogin,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div>
      {/* {isLogin ? <UserHomePage /> : <GuestHomePage />} */}
      <GuestHomePage />
    </div>
  );
}
