import { ThemeProvider } from "@emotion/react";
import { createTheme, CssBaseline } from "@mui/material";
import React from "react";

const lightBg = "rgba(243, 243, 243, .85)";

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
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: "saturate(3) blur(20px)",
          backgroundImage: "none",
        },
      },
    },
  },
});

const darkDefault = "rgba(32, 32, 32, .75)";
const darkPaper = "rgba(36, 36, 36, .8)";

const darkTheme = createTheme({
  spacing(abs: number) {
    return `${0.25 * abs}rem`;
  },
  palette: {
    mode: "dark",
    background: {
      default: darkDefault,
      paper: darkPaper,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: "saturate(3) blur(20px)",
          backgroundImage: "none",
        },
      },
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
