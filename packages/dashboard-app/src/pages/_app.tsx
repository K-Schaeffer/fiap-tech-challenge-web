import { ThemeProviderWrapper } from "@/presentation/providers/ThemeProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { AppProps } from "next/app";
import "./globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppRouterCacheProvider options={{ key: "css" }}>
      <ThemeProviderWrapper>
        <Component {...pageProps} />
      </ThemeProviderWrapper>
    </AppRouterCacheProvider>
  );
}
