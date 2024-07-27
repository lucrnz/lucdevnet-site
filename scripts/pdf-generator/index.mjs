import { resolve } from "node:path";
import fastifyStatic from "@fastify/static";
import Fastify from "fastify";
import fastifyGracefulShutdown from "fastify-graceful-shutdown";
import * as puppeteer from "puppeteer";
import getPort from "get-port";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const launchBrowser = async () => {
  const browser = await puppeteer.launch({
    args: [
      "--font-render-hinting=none",
      "--force-color-profile=srgb",
      "--disable-dev-shm-usage",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-gpu"
    ]
  });
  return browser;
};

/**
 * @param {puppeteer.Browser} browser - Puppeteer browser instance
 * @param {string} url - URL to visit
 * @param {string} outputFile - output file path for the resulting PDF.
 */
const generatePdf = async (browser, url, outputFile) => {
  const page = await browser.newPage();
  page.setViewport({ width: 794, height: 1122 });
  await page.goto(url, { waitUntil: "networkidle2" });

  /**
   * @type {number}
   */
  const removed = await page.evaluate(() => {
    return new Promise((resolve) => {
      const elementsToRemove = Array.from(
        document.querySelectorAll("[data-remove-pdf]")
      );
      for (const element of elementsToRemove) {
        element.parentElement.removeChild(element);
      }
      resolve(elementsToRemove.length);
    });
  });

  if (removed > 0) {
    console.log(`Removed ${removed} elements`);
  }

  await page.pdf({ path: outputFile, format: "A4" });
  await browser.close();
};

/**
 *
 * @param {string} contentDir - directory to host as root
 * @param {string} address - bind to address
 * @param {number} port - port to listen
 * @returns - Fastify instance
 */
const hostContent = async (contentDir, host, port) => {
  const app = Fastify({ logger: true });
  app.register(fastifyGracefulShutdown);
  app.register(fastifyStatic, { root: resolve(contentDir) });
  await app.listen({ host, port });

  let fetchSuccess = false;
  while (!fetchSuccess) {
    try {
      await fetch(`http://127.0.0.1:${port}`);
      fetchSuccess = true;
    } catch (e) {
      console.log("Waiting for content to be ready...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return app;
};

(async () => {
  /** @type {{ urlsToVisit: { url: string, outputFile: string }[], contentDir: string, host: string, port?: number }} */
  const {
    host: cfgHost,
    port: cfgPort,
    urlsToVisit,
    contentDir
  } = JSON.parse(await readFile("./config.json", "utf-8"));

  const host = cfgHost ?? "localhost";
  const port = await getPort(cfgPort ? { port: cfgPort } : undefined);

  // Check if contentDir exists
  if (!existsSync(contentDir)) {
    throw new Error(`Content directory ${contentDir} does not exist`);
  }

  const server = await hostContent(contentDir, host, port);
  const browser = await launchBrowser();

  urlsToVisit.forEach(async ({ url, outputFile }) => {
    await generatePdf(
      browser,
      new URL(url, `http://127.0.0.1:${port}`).toString(),
      outputFile
    );
    console.log(`Generated ${outputFile}`);
  });

  server.close();
})();
