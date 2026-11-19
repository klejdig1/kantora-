/** Keep localStorage uploads bounded without requiring cloud storage. */
export async function preparePhoto(file: File): Promise<string> {
  if (!file.type.startsWith("image/") || file.size > 10000000)
    throw Error("Choose an image below 10 MB.");
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const scale = Math.min(1, 1000 / Math.max(image.width, image.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(image.width * scale);
    canvas.height = Math.round(image.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw Error("Photo preparation is unavailable.");
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    const data = canvas.toDataURL("image/jpeg", 0.65);
    if (data.length > 350000)
      throw Error(
        "This image is too detailed for demo storage. Choose a smaller photograph.",
      );
    return data;
  } finally {
    URL.revokeObjectURL(url);
  }
}
