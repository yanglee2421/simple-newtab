import { MuiProvider } from "@/components/MuiProvider";
import { OptionsRouter } from "./router";
import { browser } from "wxt/browser";
import { z } from "zod";
import React from "react";

const calculateLocale = (language: string) => {
  const stringArray = language.split("-");

  if (stringArray.length === 1) {
    return stringArray[0];
  }

  return stringArray[0] + stringArray[1].toUpperCase();
};

const language = browser.i18n.getUILanguage();

z.config(Reflect.get(z.locales, calculateLocale(language))?.());

export const App = () => {
  return (
    <MuiProvider>
      <OptionsRouter />
    </MuiProvider>
  );
};
