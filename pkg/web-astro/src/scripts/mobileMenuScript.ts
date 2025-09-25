/*
 * SPDX-FileCopyrightText: 2025 Luciano Hillcoat <me@lucdev.net>
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export function setupMobileMenu() {
  const header = document.querySelector("#main-page-header")!;

  const btn = header.querySelector("#mobile-menu-btn")!;

  btn.addEventListener("click", () => {
    const isMenuOpen = header.getAttribute("data-menu-is-open") === "true";

    header.setAttribute("data-menu-is-open", isMenuOpen ? "false" : "true");
  });

  window.addEventListener("scroll", () =>
    header.setAttribute("data-menu-is-open", "false")
  );
}
