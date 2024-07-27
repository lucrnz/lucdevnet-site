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
      "--disable-gpu",
      "--disable-web-security",
      "--enable-features=NetworkService,NetworkServiceInProcess"
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
 * @param {() => Promise<unknown>} getPromise Function that returns a promise
 * @param {number} awaitTimeMs Time to wait between retries in milliseconds
 * @param {number} maxRetries Max number of retries
 * @returns {Promise<void>} Resolves when the promise is successful
 */
const retryPromise = (getPromise, awaitTimeMs = 1000, maxRetries = 10) =>
  new Promise(async (resolve, reject) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        await getPromise();
        resolve();
        return;
      } catch (e) {
        await new Promise((r) => setTimeout(r, awaitTimeMs));
      }
    }
    reject(new Error("Max retries exceeded"));
  });

/**
 * @param {string} contentDir - directory to host as root
 * @param {string} address - bind to address
 * @param {number} port - port to listen
 * @param {string|undefined} connectingHost - host to use for connecting to the server
 * @returns - Fastify instance
 */
const hostContent = async (contentDir, host, port, connectingHost) => {
  const app = Fastify({ logger: true });
  app.register(fastifyGracefulShutdown);
  app.register(fastifyStatic, { root: resolve(contentDir), redirect: true });
  await app.listen({ host, port });

  // Wait for server to be ready
  await retryPromise(async () => {
    const url = connectingHost
      ? `http://${connectingHost}:${port}`
      : `http://localhost:${port}`;
    const response = await fetch(url, {
      redirect: "follow"
    });
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }
  });

  return app;
};

(async () => {
  /** @type {{ urls: { url: string, outputFile: string }[], contentDir: string, host: string, port?: number, connectingHost?: string }} */
  const {
    host: cfgHost,
    port: cfgPort,
    connectingHost: cfgConnectingHost,
    urls,
    contentDir
  } = JSON.parse(await readFile("./config.json", "utf-8"));

  const host = cfgHost ?? "localhost";
  const port = await getPort(cfgPort ? { port: cfgPort } : undefined);
  const connectingHost = cfgConnectingHost ?? "localhost";

  // Check if contentDir exists
  if (!existsSync(contentDir)) {
    throw new Error(`Content directory ${contentDir} does not exist`);
  }

  const server = await hostContent(contentDir, host, port, connectingHost);
  const browser = await launchBrowser();

  urls.forEach(async ({ url, outputFile }) => {
    await generatePdf(
      browser,
      new URL(url, `http://${connectingHost}:${port}`).toString(),
      outputFile
    );
    console.log(`Generated ${outputFile}`);
  });

  server.close();
})();
