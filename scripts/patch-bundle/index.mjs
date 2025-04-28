import { fileURLToPath } from "url";
import path from "node:path";
import fs from "node:fs";
import fg from "fast-glob";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// License configuration
const licensePrefix = `// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0`;
const licenseSuffix = `// @license-end`;

const distDirectory = path.join(__dirname, "..", "..", "dist");

if (!fs.existsSync(distDirectory)) {
  console.error(`The dist directory does not exist: ${distDirectory}`);
  process.exit(1);
}

// Find all js/mjs/cjs files in the dist directory and its subdirectories
const pattern = "**/*.{js,mjs,cjs}";
const files = fg.sync(pattern, {
  cwd: distDirectory
});

for (const file of files) {
  const filePath = path.join(distDirectory, file);
  const content = fs.readFileSync(filePath, "utf8");

  // Check if the license prefix is already present
  if (content.startsWith(licensePrefix)) {
    console.log(`Skipping ${filePath} (already patched)`);
    continue;
  }

  // Add the license prefix and suffix
  const newContent = `${licensePrefix}\n${content}\n${licenseSuffix}`;
  fs.writeFileSync(filePath, newContent, "utf8");
  console.log(`Patched ${filePath}`);
}
