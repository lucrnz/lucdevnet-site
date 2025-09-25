/*
 * SPDX-FileCopyrightText: 2025 Luciano Hillcoat <me@lucdev.net>
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export const domReady: () => Promise<true> = () =>
  new Promise((resolve) => {
    if (
      document.readyState === "complete" ||
      document.readyState === "interactive"
    ) {
      return resolve(true);
    }
    const listener = () => {
      if (
        document.readyState === "complete" ||
        document.readyState === "interactive"
      ) {
        document.removeEventListener("readystatechange", listener);
        resolve(true);
      }
    };
    document.addEventListener("readystatechange", listener);
  });
