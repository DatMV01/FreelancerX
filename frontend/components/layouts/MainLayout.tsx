import NavbarMain from "@/features/navbar/components/NavbarMain";
import Footer from "../footer/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="m-auto flex min-h-screen max-w-[1400px] flex-col">
      <header className="my-2 px-4 md:px-8">
        <NavbarMain />
      </header>
      <main className="flex-grow px-4 md:px-8">{children}</main>
      <footer className="my-2 px-4 md:px-8">
        <Footer />
      </footer>
    </div>
  );
}
