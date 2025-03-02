import React from "react";
import Footer from "../footer";
import Navbar from "../navbar";

export default function RootLayout({ children }: { children: any }) {
  return (
    <div className="flex min-h-screen flex-col">
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
