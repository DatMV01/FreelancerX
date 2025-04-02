"use client";

import Navbar from "@/components/navbar";
import Footer from "../footer";

export default function RootLayout({ children }: { children: any }) {
  return (
    <div className="m-auto flex min-h-screen max-w-[1400px] flex-col">
      <header className="my-2 px-4 md:px-8">
        <Navbar />
      </header>
      <main className="flex-grow px-4 md:px-8">{children}</main>
      <footer className="my-2 px-4 md:px-8">
        <Footer />
      </footer>
    </div>
  );
}
