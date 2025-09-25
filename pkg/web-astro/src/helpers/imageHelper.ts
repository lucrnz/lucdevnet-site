/*
 * SPDX-FileCopyrightText: 2025 Luciano Hillcoat <me@lucdev.net>
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { getImage } from "astro:assets";

export const compressImage = async (image: ImageMetadata) =>
  await getImage({ src: image, format: "webp", quality: "high" });
