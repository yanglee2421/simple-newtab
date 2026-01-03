export const base64ToObjectUrl = (base64: string): string => {
  if (!base64) return "";
  const binary = atob(base64.split(",")[1]);
  const array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  const blob = new Blob([new Uint8Array(array)], { type: "image/jpeg" });
  return URL.createObjectURL(blob);
};

export const calc = (
  totalWidth: number,
  columns: number,
  span: number,
  columnSpacing: number,
) => {
  const noSpacingWidth = (totalWidth * span) / columns;
  const spacingWidth = (columns - span) * (columnSpacing / columns);

  return noSpacingWidth - spacingWidth;
};

export const devLog = (
  enable: boolean,
  ...args: Parameters<typeof console.log>
) => {
  if (import.meta.env.PROD) {
    return;
  }

  if (!enable) {
    return;
  }

  console.log(...args);
};
