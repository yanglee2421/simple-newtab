import React from "react";
import { MuiProvider } from "@/components/MuiProvider";
import { RouterUI } from "./RouterUI";

export const App = () => {
  return (
    <MuiProvider>
      <RouterUI />
    </MuiProvider>
  );
};
