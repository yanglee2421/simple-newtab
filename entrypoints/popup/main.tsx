import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import { MuiProvider } from "@/components/MuiProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MuiProvider>
      <App />
    </MuiProvider>
  </React.StrictMode>
);
