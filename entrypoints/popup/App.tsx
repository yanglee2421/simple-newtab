import { useState } from "react";
import reactLogo from "@/assets/react.svg";
import wxtLogo from "/wxt.svg";

const reactLogoHref = new URL(reactLogo, import.meta.url).href;
const wxtLogoHref = new URL(wxtLogo, import.meta.url).href;

export function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <img src={reactLogoHref} alt="" />
      <img src={wxtLogoHref} alt="" />
    </>
  );
}
