"use client";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { light } from "components/theme";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProviderWrapper = ({ children }: ThemeProviderProps) => {
  return (
    <ThemeProvider theme={light}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
