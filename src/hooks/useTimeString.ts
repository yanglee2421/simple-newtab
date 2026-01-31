import React from "react";

export const useTimeString = (locales?: Intl.LocalesArgument) => {
  return React.useSyncExternalStore(onAnimationFrame, () =>
    getTimeString(locales),
  );
};

const getTimeString = (locales?: Intl.LocalesArgument) => {
  return new Date().toLocaleTimeString(locales, {
    timeStyle: "short",
    hour12: false,
  });
};
