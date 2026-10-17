import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pin = process.env.STOCKROOM_PIN;
if (!pin) throw new Error("Set the STOCKROOM_PIN GitHub Actions secret before deploying.");

const source = await readFile(resolve(root, "index.html"), "utf8");
const placeholder = "__STOCKROOM_PIN_SHA256__";
if (source.split(placeholder).length !== 2) {
  throw new Error("Expected exactly one PIN hash placeholder in index.html.");
}

const pinHash = createHash("sha256").update(pin, "utf8").digest("hex");
const outputDirectory = resolve(root, "_site");
await mkdir(outputDirectory, { recursive: true });
await writeFile(resolve(outputDirectory, "index.html"), source.replace(placeholder, pinHash));
console.log("Built GitHub Pages site.");
