import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = fileURLToPath(new URL(".", import.meta.url));

const gasRootDir = path.resolve(__dirname, "../gas-root");
const gasRootDistDir = path.resolve(__dirname, "../gas-root/dist");
if (!fs.existsSync(gasRootDistDir)) {
  fs.mkdirSync(gasRootDistDir);
}

fs.copyFileSync(
  path.resolve(__dirname, ".clasp.development.json"),
  path.resolve(gasRootDir, ".clasp.json")
);
fs.copyFileSync(
  path.resolve(__dirname, "appsscript.json"),
  path.resolve(gasRootDistDir, "appsscript.json")
);
