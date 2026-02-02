import React from "react";

export const useDateString = (locales?: Intl.LocalesArgument) => {
  return React.useSyncExternalStore(
    onAnimationFrame,
    () => getDateString(locales),
    () => getDateString(locales),
  );
};

const getDateString = (locales?: Intl.LocalesArgument) => {
  return new Date().toLocaleDateString(locales, {
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "numeric",
  });
};
