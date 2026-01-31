import { ThemeProvider } from "@emotion/react";
import { createTheme, CssBaseline } from "@mui/material";
import React from "react";

const theme = createTheme({
  palette: {
    mode: "light",
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

const darkTheme = createTheme({
  palette: {
    mode: "dark",
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

const useIsDark = () => {
  const mediaQuery = matchMedia("(prefers-color-scheme: dark)");

  return React.useSyncExternalStore(
    (onStoreChange) => {
      mediaQuery.addEventListener("change", onStoreChange);

      return () => {
        mediaQuery.removeEventListener("change", onStoreChange);
      };
    },

    () => mediaQuery.matches
  );
};

export const MuiProvider = (props: React.PropsWithChildren) => {
  const isDark = useIsDark();

  return (
    <ThemeProvider theme={isDark ? darkTheme : theme}>
      <CssBaseline />
      {props.children}
    </ThemeProvider>
  );
};
