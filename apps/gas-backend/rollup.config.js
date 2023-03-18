import { babel } from "@rollup/plugin-babel";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import dotenv from "rollup-plugin-dotenv";
import copy from "rollup-plugin-copy";
import json from "@rollup/plugin-json";

// import dotenv from 'dotenv';
import path from "path";

// dotenv.config({
//   path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`)
// })

// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

console.log(`[rollup] NODE_ENV: ${process.env.NODE_ENV}`);

const extensions = [".ts", ".js"];

const preventTreeShakingPlugin = () => {
  return {
    name: "no-treeshaking",
    resolveId(id, importer) {
      if (!importer) {
        // let's not treeshake entry points, as we're not exporting anything in App Scripts
        return { id, moduleSideEffects: "no-treeshake" };
      }
      return null;
    },
  };
};

export default [
  {
    input: "src/index.ts",
    output: {
      file: "../gas-root/dist/bundle.js",
      format: "cjs",
      compact: true,
    },
    plugins: [
      dotenv({
        cwd: path.join(__dirname, `../gas-root/`),
      }),
      preventTreeShakingPlugin(),
      nodeResolve({
        extensions,
        mainFields: ["jsnext:main", "main"],
      }),
      commonjs(),
      json(),
      babel({ extensions, babelHelpers: "runtime" }),
      copy({
        targets: [
          {
            src: `.clasp.${process.env.NODE_ENV}.json`,
            dest: path.join(__dirname, "../gas-root"),
            rename: ".clasp.json",
          },
          {
            src: "appsscript.json",
            dest: path.join(__dirname, "../gas-root/dist/"),
          },
          {
            src: "tmp.html",
            dest: path.join(__dirname, "../gas-root/dist/"),
          },
        ],
      }),
    ],
  },
];
