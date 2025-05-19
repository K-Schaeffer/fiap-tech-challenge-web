import { AuthProvider } from "@/services/auth/AuthContext";
import ThemeProviderWrapper from "@/theme/ThemeProviderWrapper";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import { AppProps } from "next/app";
import { useReportWebVitals } from "next/web-vitals";
import "./globals.css";

export default function App({ Component, pageProps }: AppProps) {
  useReportWebVitals((metric) => {
    console.log(metric.name, metric.value, metric.rating);
  });

  return (
    <AppRouterCacheProvider options={{ key: "css" }}>
      <ThemeProviderWrapper>
        <AuthProvider>
          <CssBaseline />
          <Component {...pageProps} />
        </AuthProvider>
      </ThemeProviderWrapper>
    </AppRouterCacheProvider>
  );
}
