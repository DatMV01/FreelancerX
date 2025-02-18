import { InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { Geist, Roboto } from "next/font/google";
import { authOptions } from "./api/auth/[...nextauth]";
import GuestHomePage from "./home/guest_homepage";
import UserHomePage from "./home/user_homepage";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const roboto = Roboto({
  weight: "400",
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
  console.log(isLogin);

  return (
    <div className={`${roboto.className} ${geistSans.variable}  `}>
      {isLogin ? <UserHomePage /> : <GuestHomePage />}
    </div>
  );
}
