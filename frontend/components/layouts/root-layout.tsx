import React from "react";
import Footer from "../footer/Footer";
import "../navbar/Navbar";
import Navbar from "../navbar/Navbar";

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
