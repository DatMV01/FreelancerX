import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import RootLayout from "@/components/layouts/root-layout";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <RootLayout>
        <Component {...pageProps} />
      </RootLayout>
    </SessionProvider>
  );
}
