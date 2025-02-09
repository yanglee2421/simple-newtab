import { ThemeProvider } from "@emotion/react";
import { alpha, createTheme, CssBaseline } from "@mui/material";
import React from "react";

const lightBg = alpha("#fff", 0.6);

const theme = createTheme({
  spacing(abs: number) {
    return `${0.25 * abs}rem`;
  },
  palette: {
    mode: "light",
    background: {
      default: lightBg,
      paper: lightBg,
    },
  },
});

const darkBg = alpha("#000", 0.6);

const darkTheme = createTheme({
  spacing(abs: number) {
    return `${0.25 * abs}rem`;
  },
  palette: {
    mode: "dark",
    background: {
      default: darkBg,
      paper: darkBg,
    },
  },
});

const mediaQuery = matchMedia("(prefers-color-scheme: dark)");

const useIsDark = () =>
  React.useSyncExternalStore(
    (onStoreChange) => {
      mediaQuery.addEventListener("change", onStoreChange);

      return () => {
        mediaQuery.removeEventListener("change", onStoreChange);
      };
    },

    () => mediaQuery.matches,
    () => false
  );

export const MuiProvider = (props: React.PropsWithChildren) => {
  const isDark = useIsDark();

  return (
    <ThemeProvider theme={isDark ? darkTheme : theme}>
      <CssBaseline />
      {props.children}
    </ThemeProvider>
  );
};
