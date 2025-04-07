import { StoreProvider } from "@/pages/StoreProvider";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import AuthSync from "./authAsync";
import NavbarMain from "@/features/navbar/components/NavbarMain";
import Footer from "@/components/footer";

function RootLayout({ children }: { children: any }) {
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

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <StoreProvider>
        <AuthSync />
        {/* <SessionRefresher /> */}
        <RootLayout>
          <Component {...pageProps} />
        </RootLayout>
      </StoreProvider>
    </SessionProvider>
  );
}
