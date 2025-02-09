import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { MuiProvider } from "@/components/MuiProvider";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MuiProvider>
      <App />
    </MuiProvider>
  </React.StrictMode>
);
