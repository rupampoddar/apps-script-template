import { resolve } from "path";
import { defineConfig, loadEnv } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import mkcert from "vite-plugin-mkcert";
// import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

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

  // CDN url
  const CDN_URL = `${env.PUBLIC_CDN_HOST}/${env.PUBLIC_PACKAGE_VERSION}/`;
  console.log(`[vite.config.ts] cdn url: ${CDN_URL}`);

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
            index: resolve(__dirname, "index.html"),
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

        // Copy html files to gas-root/dist and assets to gas-cdn/public
        viteStaticCopy({
          targets: [
            {
              src: "dist/*.html",
              dest: resolve(__dirname, "../gas-root/dist"),
            },
            {
              src: "dist/assets/*",
              dest: resolve(
                __dirname,
                `../gas-cdn/public/${env.PUBLIC_PACKAGE_VERSION}/assets`
              ),
            },
          ],
        }),
      ],
      clearScreen: false,
      envDir: "../gas-root",
      envPrefix: "PUBLIC_",
      base: CDN_URL,
      build: {
        rollupOptions: {
          input: {
            index: resolve(__dirname, "index.html"),
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
