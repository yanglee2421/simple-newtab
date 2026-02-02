export const devLog = (
  enable: boolean,
  ...args: Parameters<typeof console.log>
) => {
  if (import.meta.env.PROD) {
    return;
  }

  if (!enable) return;

  console.log(...args);
};

export const devError = (
  enable: boolean,
  ...args: Parameters<typeof console.error>
) => {
  if (import.meta.env.PROD) {
    return;
  }

  if (!enable) return;

  console.error(...args);
};
