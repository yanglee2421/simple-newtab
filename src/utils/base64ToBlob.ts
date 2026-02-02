export const base64ToBlob = (base64: string): Blob | null => {
  if (!base64) return null;

  const [meta, data] = base64.split(",");
  if (!meta) return null;
  if (!data) return null;

  // mime type
  const match = meta.match(/data:(.*?);base64/);
  const mime = match ? match[1] : "application/octet-stream";

  const binary = atob(data);
  const len = binary.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new Blob([bytes], { type: mime });
};
