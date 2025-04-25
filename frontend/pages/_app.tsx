import MainLayout from "@/components/layouts/MainLayout";
import { StoreProvider } from "@/pages/StoreProvider";
import "@/styles/globals.css";
import { NextPage } from "next";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { ReactElement, ReactNode } from "react";
import { Toaster } from "sonner";
import {
  SyncFavoriteGigsToRedux,
  SyncSessionToRedux,
  SyncSessionToRedux2,
} from "./syncToRedux ";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  const getLayout =
    Component.getLayout ?? ((page) => <MainLayout>{page}</MainLayout>);

  return (
    <SessionProvider session={session}>
      <StoreProvider>
        <Toaster richColors position="top-right" />

        <SyncSessionToRedux />

        {/* <SyncSessionToRedux2 /> */}

        <SyncFavoriteGigsToRedux />

        {getLayout(<Component {...pageProps} />)}
      </StoreProvider>
    </SessionProvider>
  );
}
