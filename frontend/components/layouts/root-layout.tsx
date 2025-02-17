import Footer from "../footer/Footer";
import "../navbar/Navbar";
import Navbar from "../navbar/Navbar";

export default function RootLayout({ children }: { children: any }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
