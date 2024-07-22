/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
export function setupTabContainers() {
  const tabsContainers = Array.from(
    document.querySelectorAll("[data-tab-container]")
  ) as HTMLDivElement[];

  for (const tabContainer of tabsContainers) {
    const buttons = Array.from(
      tabContainer.querySelectorAll("button[data-tab-target]")
    ) as HTMLButtonElement[];

    const allTabs = Array.from(
      tabContainer.querySelectorAll(
        "[data-tab-templates] > template[data-tab-content]"
      )
    ) as HTMLTemplateElement[];

    console.log(allTabs);

    for (const button of buttons) {
      button.addEventListener("click", (_) => {
        const targetTabIndex = Number(button.dataset.tabTarget);
        const selectedTab = Number(
          (
            tabContainer.querySelector(
              "input[data-selected-tab-index]"
            )! as HTMLInputElement
          ).value
        );

        if (Number.isNaN(targetTabIndex) || Number.isNaN(selectedTab)) {
          return console.error("One of this fields is NaN", {
            targetTabIndex,
            selectedTab
          });
        }

        if (selectedTab === targetTabIndex) {
          return;
        }

        const targetDiv = tabContainer.querySelector(
          "[data-selected-tab]"
        )! as HTMLDivElement;
        const targetTemplate = allTabs.at(targetTabIndex)!;

        targetDiv.innerHTML = targetTemplate.innerHTML;

        (
          tabContainer.querySelector(
            "input[data-selected-tab-index]"
          )! as HTMLInputElement
        ).value = targetTabIndex.toString();
        buttons.forEach((x, index) => {
          x.dataset.selected = index === targetTabIndex ? "true" : "false";
        });
      });
    }
  }
}
