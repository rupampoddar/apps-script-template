import { resolve } from "path";
import { defineConfig, loadEnv } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { viteSingleFile } from "vite-plugin-singlefile";
import mkcert from "vite-plugin-mkcert";
// import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// List the html files
const htmlFiles = {
  sidebar1: resolve(__dirname, "sidebar-1.html"),
  // modal1: resolve(__dirname, "modal-1.html"),
  // sidebar2: resolve(__dirname, "sidebar-2.html"),
  // modal2: resolve(__dirname, "modal-2.html"),
  // etc.
}

// -
// https://vitejs.dev/config/
// By default, the dev server (dev command) runs in development mode and the
// build command runs in production mode.
// -
export default defineConfig(({ command, mode }) => {
  // command = serve/build
  // mode = development/staging/production
  console.log(`[vite.config.ts] command:${command}, mode:${mode}`);
  // load env vars from .env files
  // https://vitejs.dev/config/#environment-variables
  const env = loadEnv(mode, resolve(__dirname, "../gas-root"), "");

  if (command === "serve") {
    //
    // dev config
    //
    return {
      plugins: [
        tsconfigPaths(),
        //react(),
        mkcert(),
      ],
      clearScreen: false,
      envDir: "../gas-root",
      envPrefix: "PUBLIC_",
      build: {
        rollupOptions: {
          input: {
            ...htmlFiles
          },
        },
      },
      server: {
        port: 1234,
        https: true,
      },
    };
  }
  //
  // Staging/production build
  //
  else if (
    command === "build" &&
    (mode === "staging" || mode === "production")
  ) {
    return {
      esbuild: {
        drop: ["console", "debugger"],
      },
      plugins: [
        tsconfigPaths(),
        // React integration (uncomment if you're using react)
        // react(),

        // This plugin bundles everything in a single html file.
        viteSingleFile(),

        // Copy html files to gas-root/dist
        viteStaticCopy({
          targets: [
            {
              src: "dist/*.html",
              dest: resolve(__dirname, "../gas-root/dist"),
            },
          ],
        }),
      ],
      clearScreen: false,
      envDir: "../gas-root",
      envPrefix: "PUBLIC_",
      build: {
        rollupOptions: {
          input: {
            ...htmlFiles
          },
        },
      },
    };
  } else if (command === "build" && mode === "dev") {
    return {};
  } else {
    // command === 'build'
    return {};
  }
});
