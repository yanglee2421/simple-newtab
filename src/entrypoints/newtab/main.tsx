import React from "react";
import { createRoot } from "react-dom/client";
import { MuiProvider } from "@/components/MuiProvider";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MuiProvider>
      <App />
    </MuiProvider>
  </React.StrictMode>,
);
