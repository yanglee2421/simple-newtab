export function base64ToObjectUrl(base64: string): string {
  if (!base64) return "";
  const binary = atob(base64.split(",")[1]);
  const array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  const blob = new Blob([new Uint8Array(array)], { type: "image/jpeg" });
  return URL.createObjectURL(blob);
}
