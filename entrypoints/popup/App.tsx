import reactLogo from "@/assets/react.svg";
import wxtLogo from "/wxt.svg";
import { MuiProvider } from "@/components/MuiProvider";

const reactLogoHref = new URL(reactLogo, import.meta.url).href;
const wxtLogoHref = new URL(wxtLogo, import.meta.url).href;

export function App() {
  return (
    <MuiProvider>
      <img src={reactLogoHref} alt="" />
      <img src={wxtLogoHref} alt="" />
    </MuiProvider>
  );
}
