import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin, bytecodePlugin } from 'electron-vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import graphqlLoader from 'vite-plugin-graphql-loader';
import codegen from 'vite-plugin-graphql-codegen';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin(), bytecodePlugin(), graphqlLoader(), codegen()]
  },
  preload: {
    build: {
      rollupOptions: {
        input: {
          worker: resolve(__dirname, 'src/preload/workerPreload.ts'),
          ui: resolve(__dirname, 'src/preload/uiPreload.ts'),
          default: resolve(__dirname, 'src/preload/defaultPreload.ts')
        }
      }
    },
    plugins: [externalizeDepsPlugin(), bytecodePlugin()]
  },
  renderer: {
    server: {
      strictPort: true,
      port: 5180
    },
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/renderer/index.html'),
          worker: resolve(__dirname, 'src/renderer/worker/index.html'),
          ui: resolve(__dirname, 'src/renderer/ui/index.html')
        }
      }
    },
    resolve: {
      alias: {
        '@': resolve('src'),
        '@main': resolve('src/main'),
        '@preload': resolve('src/preload'),
        '@ui': resolve('src/renderer/ui/src'),
        '@worker': resolve('src/renderer/worker/src')
      }
    },
    plugins: [
      vue(),
      // https://www.npmjs.com/package/vite-plugin-vuetify
      vuetify({ autoImport: true }),
      bytecodePlugin(),
      graphqlLoader()
    ]
  }
});
