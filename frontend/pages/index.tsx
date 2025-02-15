import { CircularProgress } from "@mui/material";
import { Geist, Geist_Mono, Roboto } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div
      className={`flex h-screen flex-col items-center ${roboto.className} ${geistSans.variable} `}
    >
      <div className="mt-4 w-full text-center">Home Page</div>

      <div className="flex flex-grow items-center justify-center">
        <CircularProgress />
      </div>
    </div>
  );
}
