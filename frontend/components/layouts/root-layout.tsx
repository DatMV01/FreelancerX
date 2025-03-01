import React from "react";
import Footer from "../footer";
import Navbar from "../navbar";

export default function RootLayout({ children }: { children: any }) {
  return (
    <React.Fragment>
      <header className="px-4 md:px-8 my-2">
        <Navbar />
      </header>
      <main className="marker: px-4 md:px-8">{children}</main>
      <footer className="px-4 md:px-8 my-2">
        <Footer />
      </footer>
    </React.Fragment>
  );
}
