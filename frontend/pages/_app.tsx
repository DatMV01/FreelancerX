import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { AppCacheProvider } from "@mui/material-nextjs/v15-pagesRouter";
import RootLayout from "@/components/layouts/root-layout";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <AppCacheProvider {...pageProps}>
      <SessionProvider session={session}>
        <RootLayout>
          <Component {...pageProps} />
        </RootLayout>
      </SessionProvider>
    </AppCacheProvider>
  );
}
