type ResizeOptions = {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: "image/jpeg" | "image/webp";
};

export async function resizeImage(
  file: File,
  {
    maxWidth = 1600,
    maxHeight = 1600,
    quality = 0.85,
    mimeType = "image/jpeg",
  }: ResizeOptions = {}
): Promise<Blob> {
  const dataUrl = await readAsDataUrl(file);
  const img = await loadImage(dataUrl);

  const ratio = Math.min(
    maxWidth / img.width,
    maxHeight / img.height,
    1
  );
  const targetW = Math.round(img.width * ratio);
  const targetH = Math.round(img.height * ratio);

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context unavailable");

  ctx.drawImage(img, 0, 0, targetW, targetH);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to encode image"));
      },
      mimeType,
      quality
    );
  });
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}
