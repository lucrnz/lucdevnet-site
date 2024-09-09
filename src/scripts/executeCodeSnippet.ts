import type { ExecuteCodeSnippetRequirements } from "~/types/codeSnippet";

export default async function executeCodeSnippet({
  form,
  codeElement
}: ExecuteCodeSnippetRequirements) {
  const consoleDiv = form.querySelector(
    "[data-script-console]"
  )! as HTMLDivElement;

  const statsElement = consoleDiv.querySelector(
    "[data-script-stats]"
  )! as HTMLPreElement;

  const runButton = form.querySelector("[data-run-btn]")! as HTMLButtonElement;

  const output = consoleDiv.querySelector(
    "[data-script-output]"
  )! as HTMLPreElement;

  runButton.setAttribute("disabled", "disabled");
  consoleDiv.setAttribute("data-script-console", "visible");
  output.textContent = "";
  statsElement.textContent = "";

  let targetFn: (() => Promise<void>) | null = null;
  const code = codeElement.textContent ?? "";
  let execSuccess = false;
  let evalTime: number | null = null;
  const realConsole = {
    log: console.log,
    error: console.error,
    rest: console
  };

  const serializeArg = (arg: unknown) =>
    typeof arg === "string" || typeof arg === "number"
      ? arg.toString()
      : JSON.stringify(arg, null, 2);
  window.console = {
    ...window.console,
    log: (...args) => {
      const dataStr = args.map(serializeArg).join("\n");
      if ((output.textContent ?? "").length > 0) {
        output.textContent = output.textContent + "\n" + dataStr;
      } else {
        output.textContent = dataStr;
      }
    },
    error: (...args) => {
      output.textContent =
        output.textContent + "\nError: " + args.map(serializeArg).join("\n");
    }
  };

  try {
    if (code.length === 0) {
      throw new Error("Code is empty");
    }
    targetFn = eval("(async function() {\n%code%\n});".replace("%code%", code));

    if (typeof targetFn !== "function") {
      throw "Malformed code";
    }

    evalTime = performance.now();

    await targetFn();
    execSuccess = true;
  } catch (error) {
    execSuccess = false;
    if (error instanceof Error) {
      output.textContent = error.message;
    } else {
      output.textContent = JSON.stringify(error, null, 2);
    }
  } finally {
    let totalTime = evalTime ? performance.now() - evalTime : null;
    const totalTimeStr = totalTime
      ? `Execution time: ${totalTime.toFixed(2)}ms\n`
      : "";

    statsElement.textContent = `${totalTimeStr}Success: ${execSuccess}`;
    window.console = {
      ...realConsole.rest,
      log: realConsole.log,
      error: realConsole.error
    };
    runButton.removeAttribute("disabled");
  }
}
