/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { getRandomInt } from "./randomInt";

type TypewriterOptions = {
  selector: string;
  keystrokeSpeed: [number, number];
  cursorBlinkSpeed: number;
  timeBetweenCycleMs: number;
  initialDelayMs?: number;
};

class Typewriter {
  private elements: HTMLElement[];
  private typeValues: string[][];
  private options: TypewriterOptions;

  constructor(options: TypewriterOptions) {
    this.options = options;
    [this.elements, this.typeValues] = this.getElementsAndValues();
  }

  private getElementsAndValues(): [HTMLElement[], string[][]] {
    const elements = Array.from(
      document.querySelectorAll(
        `${this.options.selector} > span[data-type-content]`
      )
    ) as HTMLElement[];

    const typeValues = elements
      .map((el) => {
        const parent = el.parentElement!;
        const values = parent.getAttribute("data-type-values");
        return values ? values.split(",").map((v) => v.trim()) : [el.innerText];
      })
      .filter((x) => x !== null);

    return [elements, typeValues];
  }

  private async typeText(element: HTMLElement, text: string) {
    for (let i = 0; i < text.length; i++) {
      element.innerText = text.substring(0, i + 1);
      await new Promise((resolve) =>
        setTimeout(
          resolve,
          getRandomInt(
            this.options.keystrokeSpeed[0],
            this.options.keystrokeSpeed[1]
          )
        )
      );
    }
  }

  private async cycleTexts(element: HTMLElement, texts: string[]) {
    let iteration = 0;
    let runLoop = true;

    const timeout = setTimeout(
      (async () => {
        while (runLoop) {
          for (const text of texts) {
            if (iteration > 0) {
              await this.typeText(element, text);
              await new Promise((resolve) =>
                setTimeout(resolve, this.options.timeBetweenCycleMs)
              );
            }
            iteration++;
            await this.eraseText(element);
          }
        }
      }).bind(this),
      this.options.initialDelayMs
    );

    return () => {
      runLoop = false;
      clearTimeout(timeout);
    };
  }

  private async eraseText(element: HTMLElement) {
    const text = element.innerText;
    for (let i = text.length; i > 0; i--) {
      const targetValue = text.substring(0, i - 1);
      element.innerText = targetValue;
      await new Promise((resolve) =>
        setTimeout(resolve, this.options.keystrokeSpeed[1] / 2)
      );
    }
  }

  private setupCursorBlink(element: HTMLElement) {
    const existingElement = element.parentElement!.querySelector(
      "span[data-type-cursor]"
    );
    const cursor = existingElement
      ? (existingElement as HTMLSpanElement)
      : document.createElement("span");

    cursor.textContent = "|";
    if (!cursor.classList.contains("opacity-100")) {
      cursor.classList.add("opacity-100");
    }

    if (!existingElement) {
      element.insertAdjacentElement("afterend", cursor);
    }

    return setInterval(() => {
      if (cursor.classList.contains("opacity-100")) {
        cursor.classList.remove("opacity-100");
        cursor.classList.add("opacity-0");
      } else {
        cursor.classList.add("opacity-100");
        cursor.classList.remove("opacity-0");
      }
    }, this.options.cursorBlinkSpeed);
  }

  public async start() {
    const stopFns = await Promise.all(
      this.elements.map(async (element, index) => {
        const interval = this.setupCursorBlink(element);
        const stopCycle = await this.cycleTexts(
          element,
          this.typeValues[index]
        );

        return () => {
          clearInterval(interval);
          stopCycle();
        };
      })
    );

    return {
      stop: () => stopFns.forEach((x) => x())
    };
  }
}

export function homePageScript() {
  let cleanupResolve: (val: () => void) => void;
  const cleanup = new Promise<() => void>((resolve) => {
    cleanupResolve = resolve;
  });

  const setup = async () => {
    const { stop: stopFn } = await new Typewriter({
      selector: "h2[data-type-values]",
      initialDelayMs: 2000,
      keystrokeSpeed: [150, 180],
      cursorBlinkSpeed: 600,
      timeBetweenCycleMs: 3000
    }).start();

    cleanupResolve(stopFn);
  };

  return { setup, cleanup };
}
