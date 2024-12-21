import { ThemeProvider } from "@emotion/react";
import { createTheme, CssBaseline } from "@mui/material";
import React from "react";

const theme = createTheme({
  spacing(abs: number) {
    return `${0.25 * abs}rem`;
  },
});

export const MuiProvider = (props: React.PropsWithChildren) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {props.children}
    </ThemeProvider>
  );
};
