import React from "react";
import Footer from "../footer";
import Navbar from "../navbar";

export default function RootLayout({ children }: { children: any }) {
  return (
    <React.Fragment>
      <header className="px-4 md:px-14">
        <Navbar />
      </header>
      <main className="px-4 md:px-14">{children}</main>
      <footer className="px-4 md:px-14">
        <Footer />
      </footer>
    </React.Fragment>
  );
}
