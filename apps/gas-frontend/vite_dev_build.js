/**
 * Builds dev html pages
 */
import fs from "fs";
import path from "path";
import { stdout, stderr } from "process";
import { fileURLToPath } from "url";
import { build } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { viteStaticCopy } from "vite-plugin-static-copy";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const srcHtmlDir = path.resolve(__dirname);
const devDir = path.resolve(__dirname, "dev");
const tempDir = path.resolve(__dirname, "temp");
const tempOutDir = path.resolve(__dirname, "temp/out");
const gasRootDistDir = path.resolve(__dirname, "../gas-root/dist");

//
// Step 1: Cleanup previous build files
//
// Delete temp and recreate temp and temp/out
stdout.write(`[vite_dev_build] cleaning up previous build files ...\n`);
fs.rmSync(tempDir, { recursive: true, force: true });
fs.mkdirSync(tempOutDir, { recursive: true });

//
// Step 2: Get the names of the (original/prod) html files.
//
// For each html file, create a dummy html file from the dev/template.html file
stdout.write(
  `[vite_dev_build] generating development html files from template ...\n`
);
const rootFiles = fs.readdirSync(srcHtmlDir);
for (let i = 0; i < rootFiles.length; i++) {
  const f = rootFiles[i];
  // find all .html files
  if (
    fs.existsSync(path.resolve(srcHtmlDir, f)) &&
    fs.lstatSync(path.resolve(srcHtmlDir, f)).isFile() &&
    path.extname(f) === ".html"
  ) {
    // copy dev/template.html to temp/[filename]
    stdout.write(`[vite_dev_build] copying dev/template.html -> temp/${f}\n`);
    fs.copyFileSync(
      path.resolve(devDir, "template.html"),
      path.resolve(tempDir, f)
    );
  }
}
// copy dev/index.js to temp/index.js
stdout.write(`[vite_dev_build] copying dev/index.js -> temp/index.js\n`);
fs.copyFileSync(
  path.resolve(devDir, "index.js"),
  path.resolve(tempDir, "index.js")
);

//
// Step 3: Build the dummy html files individually
//
// These files will be uploaded to apps script server during development.
// Used as a container to host the local dev server contents in iframe.
stdout.write(`[vite_dev_build] building development html files ...\n`);

const tempFiles = fs.readdirSync(tempDir);
for (let i = 0; i < tempFiles.length; i++) {
  const f = tempFiles[i];
  if (
    fs.existsSync(path.resolve(tempDir, f)) &&
    fs.lstatSync(path.resolve(tempDir, f)).isFile() &&
    path.extname(f) === ".html"
  ) {
    stdout.write(`[vite_dev_build] building: ${f}\n`);
    await build({
      root: tempDir,
      configFile: false,
      clearScreen: false,
      define: {
        "process.env.FILENAME": JSON.stringify(f),
        "process.env.PORT": JSON.stringify("1234"),
      },
      plugins: [
        viteSingleFile(),
        viteStaticCopy({
          targets: [
            {
              src: path.resolve(tempOutDir, f),
              dest: gasRootDistDir,
            },
          ],
        }),
      ],
      build: {
        rollupOptions: {
          input: path.resolve(tempDir, f),
          output: {
            dir: tempOutDir,
          },
        },
      },
    });
  }
}

//
// Step 4: Cleanup
//
stdout.write(`[vite_dev_build] cleaning up ...\n`);
fs.rmSync(tempDir, { recursive: true, force: true });