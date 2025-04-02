import RootLayout from "@/components/layouts/root-layout";
import { StoreProvider } from "@/pages/StoreProvider";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import AuthSync, { SessionRefresher } from "./authAsync";

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
