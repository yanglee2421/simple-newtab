import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { MuiProvider } from "@/components/MuiProvider";
import { QueryProvider } from "@/components/query";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryProvider>
      <MuiProvider>
        <App />
      </MuiProvider>
    </QueryProvider>
  </React.StrictMode>
);
