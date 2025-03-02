import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { DocumentHeadTags } from "@mui/material-nextjs/v15-pagesRouter";
import { Head, Html, Main, NextScript } from "next/document";

export default function Document(props: any) {
  return (
    <Html lang="en">
      <Head>
        <DocumentHeadTags {...props} />
      </Head>
      <body>
        <AppRouterCacheProvider>
          <Main />
          <NextScript />
        </AppRouterCacheProvider>
      </body>
    </Html>
  );
}
