import { MuiProvider } from "@/components/MuiProvider";
import { MenuOutlined, TranslateOutlined } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Toolbar,
  alpha,
  styled,
  Link,
} from "@mui/material";
import React from "react";
import { RouterUI } from "./RouterUI";

export const App = () => {
  return (
    <MuiProvider>
      <RouterUI />
    </MuiProvider>
  );
};
