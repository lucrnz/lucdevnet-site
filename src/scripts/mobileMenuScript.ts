let scrollEvSet = false;

export function setupMobileMenu() {
  const header = document.querySelector("#main-page-header") as HTMLDivElement;

  const btn = header.querySelector("#mobile-menu-btn") as HTMLButtonElement;

  btn.addEventListener("click", () => {
    const isMenuOpen = header.getAttribute("data-menu-is-open") === "true";

    header.setAttribute("data-menu-is-open" , isMenuOpen ? "false" : "true");
  });

  window.addEventListener("scroll", () => header.setAttribute("data-menu-is-open", "false"));
}
