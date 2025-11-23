import { MuiProvider } from "@/components/MuiProvider";
import { OptionsRouter } from "./router";

export const App = () => {
  return (
    <MuiProvider>
      <OptionsRouter />
    </MuiProvider>
  );
};
