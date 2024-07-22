import { getImage } from "astro:assets";

export const compressImage = async (image: ImageMetadata) =>
  await getImage({ src: image, format: "avif", quality: "95" });
