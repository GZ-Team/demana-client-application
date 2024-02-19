// electron.vite.config.ts
import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin, bytecodePlugin, splitVendorChunkPlugin } from "electron-vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import graphqlLoader from "vite-plugin-graphql-loader";
import codegen from "vite-plugin-graphql-codegen";
var __electron_vite_injected_dirname = "C:\\Users\\Laerolf\\Documents\\Projects\\demana-client-application";
var electron_vite_config_default = defineConfig({
  main: {
    plugins: [
      externalizeDepsPlugin(),
      bytecodePlugin(),
      codegen({ throwOnStart: false, throwOnBuild: false }),
      splitVendorChunkPlugin()
    ]
  },
  preload: {
    build: {
      rollupOptions: {
        input: {
          worker: resolve(__electron_vite_injected_dirname, "src/preload/workerPreload.ts"),
          ui: resolve(__electron_vite_injected_dirname, "src/preload/uiPreload.ts"),
          default: resolve(__electron_vite_injected_dirname, "src/preload/defaultPreload.ts")
        }
      }
    },
    plugins: [
      externalizeDepsPlugin(),
      bytecodePlugin(),
      splitVendorChunkPlugin()
    ]
  },
  renderer: {
    server: {
      strictPort: true,
      port: 5180
    },
    build: {
      rollupOptions: {
        input: {
          index: resolve(__electron_vite_injected_dirname, "src/renderer/index.html"),
          worker: resolve(__electron_vite_injected_dirname, "src/renderer/worker/index.html"),
          ui: resolve(__electron_vite_injected_dirname, "src/renderer/ui/index.html")
        }
      }
    },
    resolve: {
      alias: {
        "@": resolve("src"),
        "@main": resolve("src/main"),
        "@preload": resolve("src/preload"),
        "@ui": resolve("src/renderer/ui/src"),
        "@worker": resolve("src/renderer/worker/src")
      }
    },
    plugins: [
      vue(),
      // https://www.npmjs.com/package/vite-plugin-vuetify
      vuetify({ autoImport: true }),
      bytecodePlugin(),
      graphqlLoader(),
      splitVendorChunkPlugin()
    ]
  }
});
export {
  electron_vite_config_default as default
};
