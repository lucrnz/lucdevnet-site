/*
 * SPDX-FileCopyrightText: 2025 Luciano Hillcoat <me@lucdev.net>
 * SPDX-License-Identifier: AGPL-3.0-only
 */

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
 * @param {string} contentDir - directory to host as root
 * @param {string} address - bind to address
 * @param {number} port - port to listen
 * @returns - Fastify instance
 */
const hostContent = async (contentDir, host, port) => {
  const app = Fastify({ logger: true });
  app.register(fastifyGracefulShutdown);
  app.register(fastifyStatic, { root: resolve(contentDir), redirect: true });
  await app.listen({ host, port });
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

  for (const { url: itemUrl, outputFile } of urls) {
    const requestUrl = new URL(
      itemUrl,
      `http://${connectingHost}:${port}`
    ).toString();
    await generatePdf(browser, requestUrl, outputFile);
    console.log(`Generated ${outputFile}`);
  }

  await browser.close();
  server.close();
})();
