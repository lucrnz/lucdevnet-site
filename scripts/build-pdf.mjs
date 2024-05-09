import { resolve } from "node:path";
import fastifyStatic from "@fastify/static";
import Fastify from "fastify";
import fastifyGracefulShutdown from "fastify-graceful-shutdown";
import * as puppeteer from "puppeteer";

/**
 * @param {string} url - URL to visit
 * @param {string} outputFile - output file path for the resulting PDF.
 */
const generatePdf = async (url, outputFile) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  await page.evaluate(() => {
    return new Promise((resolve) => {
      const elementsToRemove = Array.from(
        document.querySelectorAll("[data-hide-pdf]")
      );
      for (const element of elementsToRemove) {
        element.remove();
      }
      resolve();
    });
  });

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
const hostContent = async (contentDir, address = "localhost", port = 3000) => {
  const app = Fastify({ logger: true });
  app.register(fastifyGracefulShutdown);
  app.register(fastifyStatic, { root: resolve(contentDir) });
  await app.listen({ host: address, port });
  return app;
};

(async () => {
  const server = await hostContent("dist");
  await generatePdf("http://localhost:3000/resume", "./dist/resume/resume.pdf");
  server.close();
})();
